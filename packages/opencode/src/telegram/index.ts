import { Hono } from "hono"
import { Log } from "../util/log"
import { Config } from "../config/config"
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

let telegramToken: string | undefined

export async function startTelegramBot() {
  const config = await getTelegramConfig()

  if (!config.enabled || !config.token) {
    log.info("Telegram bot is disabled or no token configured")
    return
  }

  telegramToken = config.token
  log.info("Starting Telegram bot...")

  const telegramEndpoint = `https://api.telegram.org/bot${config.token}`

  async function getMe() {
    const response = await fetch(`${telegramEndpoint}/getMe`)
    return response.json()
  }

  async function sendMessage(chatId: string, text: string, replyToMessageId?: number) {
    const body: any = { chat_id: chatId, text, parse_mode: "Markdown" }
    if (replyToMessageId) body.reply_to_message_id = replyToMessageId
    await fetch(`${telegramEndpoint}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  async function sendAction(chatId: string, action: string = "typing") {
    await fetch(`${telegramEndpoint}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action }),
    })
  }

  const botInfo = await getMe()
  if (!botInfo.ok) {
    log.error("Failed to get bot info", botInfo)
    return
  }

  log.info(`Telegram bot @${botInfo.result.username} is running`)

  const sessions = new Map<string, { chatId: string; lastActivity: number }>()

  async function handleMessage(chatId: string, text: string, messageId: number) {
    if (text.startsWith("/start")) {
      await sendMessage(chatId, "🤖 *Welcome to OpenCode!*\\n\\nI can help you with coding tasks. Just send me your question or request and I'll help you out!", messageId)
      return
    }

    if (text.startsWith("/new")) {
      sessions.delete(chatId)
      await sendMessage(chatId, "✨ New session started! What would you like to work on?", messageId)
      return
    }

    if (text.startsWith("/help")) {
      await sendMessage(
        chatId,
        "*Commands:*\\n\\n" +
        "/start - Welcome message\\n" +
        "/new - Start new session\\n" +
        "/help - Show this help\\n\\n" +
        "Just send me any message to start coding!",
        messageId
      )
      return
    }

    await sendAction(chatId, "typing")

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
        await sendMessage(chatId, "❌ Error: Could not connect to OpenCode server. Make sure it's running with `opencode serve`", messageId)
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        await sendMessage(chatId, "❌ Error: No response body", messageId)
        return
      }

      let fullResponse = ""
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        
        // Handle SSE format: data: {"type":"content","content":"..."}\n\n
        const lines = chunk.split("\n")
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === "content" && data.content) {
                fullResponse += data.content
              }
            } catch {
              // Not JSON, might be other SSE data
            }
          }
        }
      }

      sessions.set(chatId, { chatId, lastActivity: Date.now() })

      if (fullResponse.trim()) {
        // Send in chunks if too long (Telegram max 4096 chars)
        const maxLength = 4000
        if (fullResponse.length <= maxLength) {
          await sendMessage(chatId, fullResponse, messageId)
        } else {
          const chunks = fullResponse.match(new RegExp(`.{1,${maxLength}}`, "g")) || []
          for (const chunk of chunks) {
            await sendMessage(chatId, chunk)
          }
        }
      } else {
        await sendMessage(chatId, "✓ Task completed! (No text response)", messageId)
      }
    } catch (err) {
      log.error("Error handling message", err)
      await sendMessage(chatId, "❌ Error processing your request. Make sure OpenCode server is running.", messageId)
    }
  }

  const server = Bun.serve({
    port: 0,
    fetch(req) {
      return handleUpdate(req)
    },
  })

  async function handleUpdate(req: Request): Promise<Response> {
    try {
      const update = await req.json()

      if (!update.message || !update.message.text) {
        return new Response("OK")
      }

      const message = update.message
      const chatId = message.chat.id.toString()
      const text = message.text
      const messageId = message.message_id

      log.info(`Received message from ${chatId}: ${text.substring(0, 50)}...`)

      handleMessage(chatId, text, messageId).catch((err) => {
        log.error("Error in handleMessage", err)
      })
    } catch (err) {
      log.error("Error handling update", err)
    }

    return new Response("OK")
  }

  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL
  if (webhookUrl) {
    await fetch(`${telegramEndpoint}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    })
    log.info(`Webhook set to ${webhookUrl}`)
  }

  log.info(`Telegram bot listening on port ${server.port}`)
}