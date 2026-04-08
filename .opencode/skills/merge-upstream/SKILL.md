---
name: merge-upstream
description: Merge upstream opencode dev branch into Soul-Brews fork. Use when user says "merge upstream", "sync upstream", "pull dev".
---

# /merge-upstream - Sync Soul-Brews Fork

Merge upstream `dev` branch, analyze changes, update changelog.

## Usage

```
/merge-upstream          # Merge and update changelog
/merge-upstream --dry    # Preview only, no merge
```

---

## Step 1: Fetch & Analyze

```bash
# Fetch upstream (ghq is simpler than git fetch)
ghq get -u https://github.com/anomalyco/opencode

# Check new commits
REPO="/Users/nat/Code/github.com/anomalyco/opencode"
git -C "$REPO" log --oneline HEAD..origin/dev
```

If empty → already up to date, stop here.

### Analyze changes
```bash
# New features
git -C "$REPO" log --oneline HEAD..origin/dev --grep="feat"

# Bug fixes  
git -C "$REPO" log --oneline HEAD..origin/dev --grep="fix"

# Check for conflicts with our files
git -C "$REPO" diff --name-only HEAD..origin/dev | grep -E "sdk.tsx|yolo|config.ts|flag.ts|next.ts"
```

---

## Step 2: Merge (if not --dry)

```bash
REPO="/Users/nat/Code/github.com/anomalyco/opencode"
git -C "$REPO" merge origin/dev --no-edit
```

If conflicts:
1. Our files to preserve: `yolo.ts`, `sdk.tsx` (500ms), `config.ts` (yolo option)
2. Resolve keeping our changes
3. `git -C "$REPO" add . && git -C "$REPO" commit`

---

## Step 3: Verify Customizations

```bash
# YOLO config preserved?
grep -A3 "yolo:" packages/opencode/src/config/config.ts

# 500ms buffer preserved?
grep "500" packages/opencode/src/cli/cmd/tui/context/sdk.tsx
```

---

## Step 4: Update Changelog

### Get merge info
```bash
# Get timestamp
date "+%Y-%m-%d %H:%M"

# Get commit range (before..after)
git log --oneline -1 HEAD  # Our new merge commit
git log --oneline HEAD..origin/dev  # What we merged (should be empty after merge)

# Get upstream commit range we merged
git log --oneline --merges -1 HEAD --format="%P"  # Parent commits
```

Edit `README.md` changelog section:

```markdown
| YYYY-MM-DD HH:MM | **Merge dev** `abc123..def456` — [description] |
```

### Changelog Format
- **Date + Time**: `YYYY-MM-DD HH:MM` (Bangkok time)
- **Commit range**: `` `oldHash..newHash` `` (short hashes, 7 chars)
- **Bold action**: `**Merge dev**`, `**Initial fork**`
- **Description**: Key features (max 3) or fix summary
- Keep one line per entry

### Example
```markdown
| 2026-01-18 14:45 | **Merge dev** `d13c0ea..ee4ea65` — ACP session fixes |
```

---

## Step 5: Rebuild & Push

```bash
# Rebuild binary
cd packages/opencode && bun run build

# Verify
~/bin/opencode-soulbrews --version

# Push
git push soul-brews soul-brews-v1.1.25:main --no-verify
```

---

## Output Summary

```markdown
## Merge Complete

| Item | Status |
|------|--------|
| Commits merged | X |
| New features | [list] |
| Bug fixes | X |
| Conflicts | none / resolved |
| Customizations | preserved |
| Binary rebuilt | version |
```

---

## Soul-Brews Customizations to Preserve

| File | Change |
|------|--------|
| `src/cli/cmd/tui/context/sdk.tsx` | 500ms buffer (line ~XX) |
| `src/cli/cmd/yolo.ts` | YOLO command (new file) |
| `src/yolo/index.ts` | YOLO module (new file) |
| `src/config/config.ts` | `yolo` config option |
| `src/flag/flag.ts` | `OPENCODE_YOLO` flag |
| `src/permission/next.ts` | YOLO auto-approve |
| `src/index.ts` | `--yolo` CLI flag |

---

ARGUMENTS: [--dry]
