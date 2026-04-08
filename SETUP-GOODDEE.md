# Gooddee Setup

ติดตั้งกู๊ดดี้ให้เหมือนต้นฉบับ!

## Quick Setup

```bash
# 1. Clone repo
git clone https://github.com/nattagidgig-hash/opencode-cli.git
cd opencode-cli

# 2. Run setup script
chmod +x gooddee-setup.sh
./gooddee-setup.sh

# 3. Restart terminal & run
exec zsh
claude
```

## What's Included

| File | Description |
|------|-------------|
| `gooddee-config/CLAUDE.md` | Constitution - วิธีคิด, หลักการ |
| `gooddee-config/RTK.md` | Token optimizer docs |
| `gooddee-config/settings.json` | Hooks, notifications, preferences |
| `gooddee-setup.sh` | Setup script |

## After Setup

- **Model**: Haiku (fast, cheap)
- **Hooks**: RTK rewrite, Prettier auto-format
- **Skills**: `/ship`, `/learn`, `/self-improve`, etc.
- **Notifications**: macOS alerts on task complete

## Optional: Install RTK

```bash
brew install rtk
```

ประหยัด 60-90% tokens ตอนใช้ Claude Code!

## Optional: Install MCPs

```bash
# memory - Knowledge graph
# github - Repo management
# puppeteer - Browser automation
# google-calendar - Calendar management
# cloudflare - Workers/D1/KV
```

ดูเพิ่มเติมที่: https://docs.anthropic.com/en/docs/claude-code/mcp