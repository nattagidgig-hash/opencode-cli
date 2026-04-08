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

export async function startTelegramBot() {
  const config = await getTelegramConfig()

  if (!config.enabled || !config.token) {
    log.info("Telegram bot is disabled or no token configured")
    return
  }

  log.info("Starting Telegram bot...")

  const { serve } = await import("bun")
  const telegramEndpoint = `https://api.telegram.org/bot${config.token}`

  async function getMe() {
    const response = await fetch(`${telegramEndpoint}/getMe`)
    return response.json()
  }

  async function sendMessage(chatId: string, text: string, replyToMessageId?: number) {
    const body: any = { chat_id: chatId, text }
    if (replyToMessageId) body.reply_to_message_id = replyToMessageId
    await fetch(`${telegramEndpoint}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  }

  const botInfo = await getMe()
  if (!botInfo.ok) {
    log.error("Failed to get bot info", botInfo)
    return
  }

  log.info(`Telegram bot @${botInfo.result.username} is running`)

  const server = serve({
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
      const chatId = message.chat.id
      const text = message.text
      const messageId = message.message_id

      log.info(`Received message from ${chatId}: ${text}`)

      await sendMessage(chatId.toString(), "🤖 I'm your opencode assistant! Use the /start command to begin.", messageId)
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