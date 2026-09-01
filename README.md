# R6 HUD caminsert by B3RC1

Node.js broadcast overlay for Rainbow Six Siege. Connects observer spectate positions (1–10) to player webcam feeds via VDO.ninja, with multiple HUD view templates for production (ingame insert, fullscreen, team sides, pick screen, etc.).

When the in-game observer switches spectate slot, a global hotkey listener tells all open browser views which camera to show.

## System requirements

- **Windows only** (global hotkeys use `iohook`, which requires native bindings on Windows).
- **Node.js v13–14** (see `package.json` / release notes; `iohook` binary compatibility).
- **MySQL or MariaDB** for teams and players.
- **Keyboard layout:** Hungarian or English (US) — spec slot 10 uses `ö` (HU) or `0` (US).
- Strong PC recommended if you run the game plus many browser sources on the production machine.

## Installation

1. Clone or download the repository.
2. Install Node.js v13.14.0 (installer in repo) or use nvm.
3. Run `install_dependencies.bat` or `npm install`.
4. Copy `env.template` to `.env` and set database credentials and optional stream params.
5. Create the database and import schema from `misc/r6_hud.sql` (or your own migrated schema).
6. Add static assets (see [Static assets](#static-assets) below).
7. Start with `run.bat` or `npm start`.

### Environment variables (`.env`)

| Variable | Required | Purpose |
|----------|----------|---------|
| `DB_HOST` | Yes | MySQL host |
| `DB_PORT` | Yes | MySQL port (usually `3306`) |
| `DB_USER` | Yes | Database user |
| `DB_PASSWORD` | Yes | Database password |
| `DB_NAME` | Yes | Database name (e.g. `r6_hud`) |
| `VIDEO_PARAMS` | Yes* | Query string appended to live player view URLs (e.g. `&cover&cleanoutput`). Can be empty but should be set. |

\* Required for readiness scan to pass; leave empty if you do not need extra VDO.ninja params.

## Config pages (HTTP port 8083)

| URL | Purpose |
|-----|---------|
| `/admin` | Create, edit, delete teams and players |
| `/match_control` | Pick two teams, assign 10 players to spec slots, set rotation, go live |
| `/readiness-scan` | Pre-broadcast checklist: assets, links, env, DB, duplicate URLs |

Config pages use `public/css/general.css` and background image `public/img/background.png`.

## Broadcast view pages

Open in browser sources (OBS, vMix, etc.). Each view connects to the WebSocket server on **port 6969** for hotkeys and refresh events.

| URL | Typical use |
|-----|-------------|
| `/ingame` | In-game cam insert; reacts to spec position hotkeys |
| `/fullscreen` | Single large cam + team logo |
| `/tenmen` | 10-man layout with frame overlay |
| `/ladder` | Ladder-style layout |
| `/pickscreen` | Operator pick screen |
| `/team_left` | Left team (spec slots 0–4) |
| `/team_right` | Right team (spec slots 5–9) |

Views load player data from `live_players` / `live_teams` via POST endpoints such as `/fill/ingame`.

## Hotkeys (global, via iohook)

Works while the game or another app has focus. Affects views connected over WebSocket.

| Key | Action |
|-----|--------|
| `1`–`9` | Select spec positions 0–8 (ingame / fullscreen) |
| `0` (US) / `ö` (HU) | Select spec position 9 |
| `X` | Show ingame overlay |
| `C` | Hide ingame overlay |
| `Alt+R` | Force refresh all views |
| `Alt+H` | Force hide ingame overlay |
| `Alt+S` | Force show ingame overlay |

Bindings are hardcoded in `server.js` today (not yet configurable from the UI).

## Static assets

Images are resolved from disk at runtime (case-insensitive). The database stores player/team identity only — not image URLs.

| Asset | Location | File naming |
|-------|----------|-------------|
| Player avatar | `public/img/avatars/` | `{nickname}.png` or `.jpg` |
| Team logo | `public/img/logos/` | `{shorthandle}.png` or `.jpg` |
| Country flag | `public/img/flags/` | `{countrycode}.png` or `.jpg` (e.g. `hu`, `us`) |
| Config background | `public/img/background.png` | Single file |
| Ten-man frame | `public/img/tenmenframe.png` | Single file |
| Loop video | `public/vid/loop.mp4` | Used by some views |

Missing files fall back to `backup.png` in the same folder where applicable.

Player `nationality` in the DB is a **country code** (e.g. `hu`), not a full flag URL.

## Architecture (short)

```
Observer keypress → iohook (server.js) → WebSocket :6969 → browser views
Admin / match config → Express :8083 → MySQL (teams, players, live_*)
Views fetch live match → POST /fill/ingame → resolved avatar/logo/flag paths
```

- **Master tables:** `teams`, `players` — full roster.
- **Live tables:** `live_teams`, `live_players` — current match (10 spec slots). Populated from match control.
- **Match go-live:** copies selected teams/players into live tables; all views receive `reload_view` over WebSocket.

See `PROJECT_ANALYSIS.md` for a longer internal overview.

## Good to know

- Updating match config on `/match_control` force-refreshes all connected views.
- Editing or deleting a player/team in `/admin` also triggers a refresh.
- Start the HUD server **before** your production app when possible, so browser source inputs stay stable.
- Works with R6 fullscreen/borderless, Vulkan and DirectX. If hotkeys stop working after a game patch, try DirectX borderless without admin rights.
- Max **display** length for nickname: ~13 capital `M` width (longer names can be stored).
- Max **display** length for fullname: ~22 capital `M` width.
- Use `/readiness-scan` before going live to catch missing avatars, bad VDO links, and env issues.
- View links should contain `view`; join (`con_link`) links should contain `push` (VDO.ninja convention). Duplicates are rejected at DB level and surfaced on readiness scan.

## License

Proprietary. **Not open source, not freeware.** All rights are reserved by Bertalan
Varga-Molnár; no use is permitted without a written, per-Event license. See
[`LICENSE`](LICENSE) for the full terms and licensing contact.
