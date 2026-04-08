import { cmd } from "./cmd"
import { Global } from "../../global"
import fs from "fs/promises"
import path from "path"

const TELEGRAM_CONFIG_FILE = "telegram.json"

export const TelegramCommand = cmd({
  command: "telegram",
  describe: "Configure Telegram bot",
  builder: (yargs) =>
    yargs
      .command(
        "set-token <token>",
        "Set Telegram bot token",
        (yargs) => yargs.positional("token", { type: "string", demandOption: true }),
        async (args) => {
          const configPath = path.join(Global.Path.config, TELEGRAM_CONFIG_FILE)
          const config = { token: args.token, enabled: true }
          await fs.writeFile(configPath, JSON.stringify(config, null, 2))
          console.log("✓ Telegram bot token saved!")
          console.log("  The bot will start automatically when you run 'opencode serve'")
          console.log("  To test: start the bot and send /start to your bot on Telegram")
        },
      )
      .command(
        "disable",
        "Disable Telegram bot",
        () => {},
        async () => {
          const configPath = path.join(Global.Path.config, TELEGRAM_CONFIG_FILE)
          try {
            const config = JSON.parse(await fs.readFile(configPath, "utf-8"))
            config.enabled = false
            await fs.writeFile(configPath, JSON.stringify(config, null, 2))
            console.log("✓ Telegram bot disabled")
          } catch {
            console.log("No Telegram config found")
          }
        },
      )
      .command(
        "status",
        "Show Telegram bot status",
        () => {},
        async () => {
          const configPath = path.join(Global.Path.config, TELEGRAM_CONFIG_FILE)
          try {
            const config = JSON.parse(await fs.readFile(configPath, "utf-8"))
            console.log("Telegram Bot Status:")
            console.log(`  Enabled: ${config.enabled ? "✓ Yes" : "✗ No"}`)
            console.log(`  Token: ${config.token ? "✓ Configured" : "✗ Not set"}`)
          } catch {
            console.log("Telegram Bot Status:")
            console.log("  Enabled: ✗ No")
            console.log("  Token: ✗ Not set")
          }
        },
      ),
  handler: () => {},
})