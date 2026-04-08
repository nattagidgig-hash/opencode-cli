#!/bin/bash

# Gooddee Setup Script
# ติดตั้งทุกอย่างที่กู๊ดดี้ต้องการ

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$SCRIPT_DIR/gooddee-config"

echo "🚀 Setting up Gooddee environment..."
echo "   Config dir: $CONFIG_DIR"

# Check if config dir exists
if [ ! -d "$CONFIG_DIR" ]; then
    echo "❌ Error: gooddee-config directory not found!"
    exit 1
fi

# 1. Copy CLAUDE.md
echo "📄 Installing CLAUDE.md..."
if [ -f "$CONFIG_DIR/CLAUDE.md" ]; then
    cp "$CONFIG_DIR/CLAUDE.md" ~/.claude/CLAUDE.md
    echo "   ✅ CLAUDE.md installed"
else
    echo "   ⚠️ CLAUDE.md not found, skipping..."
fi

# 2. Copy RTK.md  
echo "📄 Installing RTK.md..."
if [ -f "$CONFIG_DIR/RTK.md" ]; then
    cp "$CONFIG_DIR/RTK.md" ~/.claude/RTK.md
    echo "   ✅ RTK.md installed"
else
    echo "   ⚠️ RTK.md not found, skipping..."
fi

# 3. Copy settings.json
echo "⚙️ Installing settings.json..."
if [ -f "$CONFIG_DIR/settings.json" ]; then
    cp "$CONFIG_DIR/settings.json" ~/.claude/settings.json
    echo "   ✅ settings.json installed"
else
    echo "   ⚠️ settings.json not found, skipping..."
fi

# 4. Check/create hooks directory
echo "🔗 Checking hooks..."
if [ -d "~/.claude/hooks" ]; then
    echo "   ✅ hooks directory exists"
else
    mkdir -p ~/.claude/hooks
    echo "   ✅ hooks directory created"
fi

# 5. Check for RTK hook script
if [ -f "$CONFIG_DIR/rtk-rewrite.sh" ]; then
    echo "🔗 Installing RTK hook..."
    cp "$CONFIG_DIR/rtk-rewrite.sh" ~/.claude/hooks/
    chmod +x ~/.claude/hooks/rtk-rewrite.sh
    echo "   ✅ RTK hook installed"
fi

# 6. Add aliases to shell
echo "🔗 Adding aliases..."
SHELL_RC="$HOME/.zshrc"
if ! grep -q "# Gooddee aliases" "$SHELL_RC" 2>/dev/null; then
    cat >> "$SHELL_RC" << 'EOF'

# Gooddee aliases
alias gooddee='claude'
alias g='claude'
alias gg='claude --print'
EOF
    echo "   ✅ Aliases added to ~/.zshrc"
else
    echo "   ℹ️ Aliases already exist, skipping..."
fi

echo ""
echo "✅ Gooddee setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Restart your terminal: exec zsh"
echo "   2. Run: claude"
echo ""
echo "📝 Optional - Install RTK (token optimizer):"
echo "   brew install rtk"
echo ""
echo "📝 Optional - Install MCPs (memory, github, etc):"
echo "   See Claude Code docs for MCP setup"