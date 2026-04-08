# OpenCode CLI

OpenCode is an AI coding assistant that runs in your terminal. This version includes **Telegram bot integration** so you can chat with OpenCode from your phone!

## Quick Start

### 1. Install

```bash
# Clone the repo
git clone https://github.com/nattagidgig-hash/opencode-cli.git
cd opencode-cli

# Install dependencies
bun install

# Build
bun run build
```

### 2. Configure Telegram Bot

1. Create a new bot via [@BotFather](https://t.me/BotFather) on Telegram
2. Copy your bot token
3. Run:

```bash
bun run ./packages/opencode/bin/opencode telegram set-token <YOUR_BOT_TOKEN>
```

### 3. Run the Server

```bash
# Start the server (Telegram bot will start automatically)
bun run ./packages/opencode/bin/opencode serve
```

### 4. Start Chatting!

- Open Telegram and find your bot
- Send `/start` to begin
- Chat with OpenCode just like you would in the terminal!

## How It Works (No API Key Required!)

**This version automatically configures itself to use OpenCode Zen's free model.**

When the server starts, it automatically:
1. Checks for a `config.json` in `~/.config/opencode/`
2. If not found, creates one with the **OpenCode provider** and **gpt-5-nano model**
3. `gpt-5-nano` is powered by **big-pickle** - completely free via OpenCode Zen

**You don't need any API keys!** The configuration is handled automatically.

### Manual Configuration (Optional)

If you want to use a different model, create the config manually:

```bash
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/config.json
```

Example config:
```json
{
  "model": "opencode/gpt-5-nano"
}
```

Or with a custom model:
```json
{
  "model": "opencode/gpt-5-nano",
  "provider": {
    "opencode": {
      "enabled": true
    }
  }
}
```

## Available Models

| Model | Provider | Cost |
|-------|----------|------|
| gpt-5-nano | OpenCode Zen | Free |
| gpt-5-mini | OpenCode Zen | Paid |
| claude-sonnet-4 | Anthropic | Paid |
| gemini-2.5-flash | Google | Paid |

## Commands

```bash
# Set Telegram bot token
opencode telegram set-token <TOKEN>

# Check Telegram bot status
opencode telegram status

# Disable Telegram bot
opencode telegram disable
```

## Environment Variables (Optional)

- `TELEGRAM_WEBHOOK_URL` - Set a webhook URL for production

## Need Help?

- Check the main [OpenCode docs](https://opencode.ai)
- Issues: https://github.com/nattagidgig-hash/opencode-cli/issues