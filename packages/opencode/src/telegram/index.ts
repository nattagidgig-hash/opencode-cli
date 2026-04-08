import { Hono } from "hono"
import { Log } from "../util/log"
import { Global } from "../global"
import fs from "fs/promises"
import path from "path"

const log = Log.create({ service: "telegram" })

export interface TelegramConfig {
  token?: string
  enabled?: boolean
  allowedUsers?: string[]
}

const TELEGRAM_CONFIG_FILE = "telegram.json"

async function getTelegramConfig(): Promise<TelegramConfig> {
  try {
    const configPath = path.join(Global.Path.config, TELEGRAM_CONFIG_FILE)
    const content = await fs.readFile(configPath, "utf-8")
    return JSON.parse(content)
  } catch {
    return { enabled: false }
  }
}

async function saveTelegramConfig(config: TelegramConfig): Promise<void> {
  const configPath = path.join(Global.Path.config, TELEGRAM_CONFIG_FILE)
  await fs.writeFile(configPath, JSON.stringify(config, null, 2))
}

export function setupTelegramRoutes(app: Hono) {
  const telegramApp = new Hono()

  telegramApp.post("/set-token", async (c) => {
    const body = await c.req.json<{ token: string }>()
    if (!body.token) {
      return c.json({ error: "Token is required" }, 400)
    }

    const config = await getTelegramConfig()
    config.token = body.token
    config.enabled = true
    await saveTelegramConfig(config)

    return c.json({ success: true, message: "Telegram bot token saved. Bot will start automatically." })
  })

  telegramApp.get("/status", async (c) => {
    const config = await getTelegramConfig()
    return c.json({
      enabled: config.enabled,
      hasToken: !!config.token,
    })
  })

  telegramApp.post("/disable", async (c) => {
    const config = await getTelegramConfig()
    config.enabled = false
    await saveTelegramConfig(config)
    return c.json({ success: true, message: "Telegram bot disabled" })
  })

  app.route("/telegram", telegramApp)
}

let telegramBot: TelegramBot | undefined

class TelegramBot {
  private token: string
  private offset = 0
  private running = false
  private pollInterval: Timer | undefined

  constructor(token: string) {
    this.token = token
  }

  async start() {
    log.info("Starting Telegram bot with long polling...")

    const botInfo = await this.getMe()
    if (!botInfo.ok) {
      log.error("Failed to get bot info", botInfo)
      return
    }

    log.info(`Telegram bot @${botInfo.result.username} is running`)
    this.running = true
    this.poll()
  }

  stop() {
    this.running = false
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = undefined
    }
  }

  private get endpoint() {
    return `https://api.telegram.org/bot${this.token}`
  }

  async getMe() {
    const response = await fetch(`${this.endpoint}/getMe`)
    return response.json()
  }

  async sendMessage(chatId: string, text: string, replyToMessageId?: number) {
    const body: any = { chat_id: chatId, text, parse_mode: "Markdown" }
    if (replyToMessageId) body.reply_to_message_id = replyToMessageId
    await fetch(`${this.endpoint}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  async sendAction(chatId: string, action: string = "typing") {
    await fetch(`${this.endpoint}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action }),
    })
  }

  private async poll() {
    while (this.running) {
      try {
        const response = await fetch(`${this.endpoint}/getUpdates?timeout=30&offset=${this.offset}`)
        const updates = await response.json()

        if (!updates.ok) {
          log.error("Poll error", updates)
          await this.sleep(5000)
          continue
        }

        for (const update of updates.result) {
          if (update.message?.text) {
            this.handleMessage(update.message)
          }
          this.offset = update.update_id + 1
        }
      } catch (err) {
        log.error("Poll exception", err)
        await this.sleep(5000)
      }
    }
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async handleMessage(message: any) {
    const chatId = message.chat.id.toString()
    const text = message.text
    const messageId = message.message_id

    if (!text) return

    log.info(`Received message from ${chatId}: ${text.substring(0, 50)}...`)

    if (text.startsWith("/start")) {
      await this.sendMessage(
        chatId,
        "🤖 *Welcome to OpenCode!*\n\nI can help you with coding tasks. Just send me your question or request and I'll help you out!",
        messageId
      )
      return
    }

    if (text.startsWith("/new")) {
      await this.sendMessage(chatId, "✨ New session started! What would you like to work on?", messageId)
      return
    }

    if (text.startsWith("/help")) {
      await this.sendMessage(
        chatId,
        "*Commands:*\n\n" +
          "/start - Welcome message\n" +
          "/new - Start new session\n" +
          "/help - Show this help\n\n" +
          "Just send me any message to start coding!",
        messageId
      )
      return
    }

    await this.sendAction(chatId, "typing")

    try {
      const response = await fetch(`http://localhost:4096/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          directory: process.cwd(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        log.error("OpenCode API error", { status: response.status, error: errorText })
        await this.sendMessage(
          chatId,
          "❌ Error: Could not connect to OpenCode server. Make sure it's running with `opencode serve`",
          messageId
        )
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        await this.sendMessage(chatId, "❌ Error: No response body", messageId)
        return
      }

      let fullResponse = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })

        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === "content" && data.content) {
                fullResponse += data.content
              }
            } catch {
              // Not JSON
            }
          }
        }
      }

      if (fullResponse.trim()) {
        const maxLength = 4000
        if (fullResponse.length <= maxLength) {
          await this.sendMessage(chatId, fullResponse, messageId)
        } else {
          const chunks = fullResponse.match(new RegExp(`.{1,${maxLength}}`, "g")) || []
          for (const chunk of chunks) {
            await this.sendMessage(chatId, chunk)
          }
        }
      } else {
        await this.sendMessage(chatId, "✓ Task completed! (No text response)", messageId)
      }
    } catch (err) {
      log.error("Error handling message", err)
      await this.sendMessage(
        chatId,
        "❌ Error processing your request. Make sure OpenCode server is running.",
        messageId
      )
    }
  }
}

export async function startTelegramBot() {
  const config = await getTelegramConfig()

  if (!config.enabled || !config.token) {
    log.info("Telegram bot is disabled or no token configured")
    return
  }

  if (telegramBot) {
    telegramBot.stop()
  }

  telegramBot = new TelegramBot(config.token)
  await telegramBot.start()
}