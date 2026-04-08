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

## Commands

```bash
# Set Telegram bot token
opencode telegram set-token <TOKEN>

# Check Telegram bot status
opencode telegram status

# Disable Telegram bot
opencode telegram disable
```

## How It Works

- When you run `opencode serve`, the server starts and checks for a Telegram token
- If a token exists, the bot automatically connects and listens for messages
- Messages are processed through OpenCode's AI and you get responses back in Telegram

## Environment Variables (Optional)

- `TELEGRAM_WEBHOOK_URL` - Set a webhook URL for production

## Need Help?

- Check the main [OpenCode docs](https://opencode.ai)
- Issues: https://github.com/nattagidgig-hash/opencode-cli/issues