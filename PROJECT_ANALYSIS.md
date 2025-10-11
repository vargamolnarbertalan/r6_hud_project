# Rainbow Six Siege HUD System - Project Analysis

## Project Overview
**Project Name:** R6 HUD Camera Insert System  
**Author:** B3RC1 (mnebs7)  
**Version:** v1.0.1 (based on release file)  
**Purpose:** Live broadcast HUD system for Rainbow Six Siege esports matches that synchronizes player webcams with game spectator positions

## Core Concept
This Node.js application provides a sophisticated broadcast overlay system for Rainbow Six Siege competitive matches. The key innovation is **automatic camera switching** - when the in-game observer switches to spectate a different player (positions 1-10), the corresponding player's webcam feed automatically appears in the HUD overlay.

## Technical Architecture

### Backend Stack
- **Runtime:** Node.js v13-14 (specific requirement)
- **Framework:** Express.js (v4.17.2)
- **Template Engine:** EJS (Embedded JavaScript)
- **Database:** MySQL/MariaDB (using mysql2 driver)
- **WebSocket:** WS library (port 6969)
- **Input Hooks:** iohook (global keyboard listener)
- **HTTP Server:** Port 8083

### Key Technologies
1. **Express Server** - Serves web pages and handles API endpoints
2. **WebSocket Server** - Real-time bidirectional communication between server and all connected views
3. **Global Keyboard Hook** - Captures hotkeys even when app is not focused (critical for live production)
4. **MySQL Database** - Stores teams, players, and live match configuration
5. **VDO.ninja Integration** - Streams player webcams via web URLs

### Database Schema
Four main tables:

1. **`teams`** - Master team registry
   - `shorthandle` (PRIMARY KEY) - Team abbreviation
   - `teamname` - Full team name
   - `logo` - URL to team logo

2. **`players`** - Master player registry
   - `nickname` (PRIMARY KEY) - Player in-game name
   - `fullname` - Real name
   - `nationality` - Flag URL
   - `team_id` - Links to teams.shorthandle
   - `con_link` - VDO.ninja connection URL (for player to stream)
   - `view_link` - VDO.ninja view URL (for broadcast to display)
   - `avatar` - Player photo URL

3. **`live_teams`** - Currently active match teams (2 teams)
   - `team_pos` (PRIMARY KEY) - 0 or 1 (Team A/B)
   - Copies data from `teams` table

4. **`live_players`** - Currently active match players (10 players)
   - `spec_pos` (PRIMARY KEY) - 0-9 (spectator positions)
   - `rotate` - Camera rotation (0/90/180/270 degrees)
   - Copies data from `players` table
   - `view_link` includes appended parameters for streaming

## Application Flow

### Setup Phase
1. Admin configures teams and players via `/admin` page
2. Before match, operator uses `/match_control` to select:
   - Two competing teams
   - 5 players from each team (assigned to spec positions 0-9)
   - Camera rotation per player (if needed)
3. On submission, database copies selected data to `live_teams` and `live_players` tables
4. All connected view pages automatically refresh via WebSocket

### Live Production Phase
1. Operator runs the game (Rainbow Six Siege) on observer PC
2. Browser sources display various view pages (ingame, fullscreen, team views, etc.)
3. **Hotkey Integration:**
   - Keys 1-9, 0 (or Ö on Hungarian keyboard) → Selects spec position
   - X → Show ingame overlay
   - C → Hide ingame overlay
   - ALT+R → Force refresh all views
   - ALT+H → Force hide ingame view
   - ALT+S → Force show ingame view

### Camera Switching Mechanism
```
Observer presses "3" → iohook captures keypress → 
WebSocket broadcasts "select_pos2" → 
All view pages receive message → 
Ingame view switches to spec_pos2 player camera and info
```

## View Pages

### 1. `/ingame` - Main In-Game Overlay
- **Purpose:** Transparent overlay to composite over game feed
- **Features:**
  - 10 embedded iframes (player webcam feeds)
  - 10 player avatars
  - 2 background frame designs (for each team)
  - Switches active player based on spectator position
  - Can be shown/hidden with hotkeys

### 2. `/fullscreen` - Fullscreen Player View
- Large player camera display
- Responds to spec position hotkeys

### 3. `/tenmen` - 10-Player Grid View
- Shows all 10 players simultaneously
- Team rosters side-by-side

### 4. `/team_left` and `/team_right` - Individual Team Views
- Display single team roster
- Used for team introductions

### 5. `/ladder` - Tournament Bracket/Standings
- Shows competition ladder/bracket

### 6. `/pickscreen` - Operator Pick/Ban Phase
- For showing operator selection phase

### 7. `/admin` - Database Management
- Add/Edit/Delete teams
- Add/Edit/Delete players
- CRUD operations sync to live views automatically

### 8. `/match_control` - Match Configuration
- Select two teams for current match
- Assign 5 players per team to spec positions
- Set camera rotations per player
- Updates live tables and refreshes all views

## VDO.ninja Integration
**VDO.ninja** is a peer-to-peer video streaming service used for player webcams.

### Connection Flow
1. Each player opens their unique `con_link` URL (push link) on their device
2. Broadcast views load corresponding `view_link` URLs in iframes
3. Parameters appended: `&transparent&cover&cleanoutput&autoplay=on&mutespeaker`
4. Optional `&rotatewindow=90/180/270` for rotated camera feeds

### Example
```
con_link: https://vdo.ninja/?push=6b2akU8&quality=1&label=zhoxk
view_link: https://vdo.ninja/?view=6b2akU8&label=zhoxk
```

## Production Workflow

### Pre-Match Setup
1. Ensure MySQL database is running
2. Create `.env` file with database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=r6_hud
   VIDEO_PARAMS=[optional streaming parameters]
   ```
3. Import `misc/r6_hud.sql` to create database structure
4. Run `run.bat` to start server
5. Add teams and players via `/admin`

### During Match
1. Configure match on `/match_control` (select teams & players)
2. Players connect their webcams via VDO.ninja con_links
3. Add browser sources in OBS/vMix:
   - Main: `localhost:8083/ingame` (transparent overlay)
   - Optional: Other views as needed
4. Position ingame overlay over game capture
5. Use hotkeys to switch cameras as observer changes spectator position
6. Use X/C to show/hide overlay

### Post-Match
- Data persists in database
- Can immediately configure next match

## File Structure

### Key Directories
- **`/public`** - Static assets (CSS, fonts, images)
  - `/css` - Stylesheets for each view
  - `/font` - Chakra Petch font family
  - `/img` - Favicon
  - `/vid` - Background loop video
  
- **`/views`** - EJS templates for all pages
  
- **`/gfx`** - Design assets (PSD, PNG overlays, frames)
  
- **`/misc`** - Database schema, demo JSON

- **`/_release`** - Packaged releases

- **`/demo_tools`** - Node.js installer, demo screenshots

### Key Files
- **`server.js`** - Main application entry point
- **`package.json`** - Dependencies
- **`.env`** - Environment variables (not in repo)
- **`run.bat`** - Startup script
- **`install_dependencies.bat`** - NPM install wrapper

## Critical Dependencies
```json
{
  "express": "^4.17.2",      // Web server
  "ejs": "^3.1.6",           // Templating
  "mysql2": "^2.3.3",        // Database
  "ws": "^8.4.2",            // WebSocket
  "iohook": "^0.9.3",        // Global hotkeys
  "body-parser": "^1.19.1",  // Form parsing
  "dotenv": "^16.4.5"        // Environment config
}
```

## System Requirements
- **OS:** Windows only (iohook limitation)
- **Keyboard:** Hungarian or English (US) layout
- **Node.js:** v13-14 specifically
- **Hardware:** Strong PC recommended for running all views + game

## Security Considerations ⚠️

### SQL Injection Vulnerabilities
**STATUS: FIXED** - All SQL queries have been refactored to use parameterized statements.

**Before:**
```javascript
var sql = `
  INSERT INTO teams (teamname, shorthandle, logo) 
  VALUES ('${req.body.add_teamname}', '${req.body.add_shorthandle}', '${req.body.add_logo}');
`;
```

**After:**
```javascript
var sql = `INSERT INTO teams (teamname, shorthandle, logo) VALUES (?, ?, ?)`;
db.query(sql, [req.body.add_teamname, req.body.add_shorthandle, req.body.add_logo], callback);
```

All endpoints including the complex match configuration endpoint (with 12 multi-table UPDATE statements) have been secured.

### Other Security Notes
- **No authentication on admin pages** - Intentional design for local-only operation
  - System designed for isolated production network
  - Future consideration: global central server with authentication behind paywall
- URLs stored in database (minimal XSS risk in current local-only deployment model)

## Strengths & Innovations

✅ **Clever Hotkey Integration** - iohook enables seamless keyboard control without app focus  
✅ **Real-time Sync** - WebSocket ensures all views update instantly  
✅ **Flexible Design** - Multiple view types for different broadcast needs  
✅ **VDO.ninja Integration** - Smart use of P2P streaming for low-latency webcams  
✅ **Production-Ready** - Handles real esports broadcasts  
✅ **Live Updates** - Edit player/team data and views refresh automatically  

## Areas for Improvement

✅ **SQL Injection** - ~~Critical security vulnerability~~ **FIXED** - All queries now use parameterized statements  
⚠️ **No Input Validation** - Forms accept any input (acceptable for local-only trusted environment)  
⚠️ **jQuery in 2025** - Could modernize to modern framework (React/Vue)  
⚠️ **Repetitive Code** - Ingame view has massive code duplication for 10 positions  
⚠️ **No Error Handling** - Limited error recovery in production (mitigated by VDO.ninja fallback to avatars)  
⚠️ **Old Node.js** - Locked to v13-14 (confirmed: iohook binary compatibility limitation)  
⚠️ **No TypeScript** - Large codebase would benefit from type safety  
⚠️ **Hard-coded Values** - Magic numbers, URLs embedded in code  
⚠️ **Siege X Compatibility** - Not yet tested with Rainbow Six Siege X (new game version)  

## Use Cases
1. **Esports Broadcasts** - Professional R6 Siege tournament streams
2. **Showmatches** - Community tournaments with player cams
3. **Scrimmages** - Practice matches with production value
4. **LAN Events** - Local tournaments with live audience

## Notable Design Decisions

### Two-Team System
- System is designed specifically for 5v5 matches
- Exactly 10 spectator positions mapped to 10 players
- Two overlay frames for each team's visual style

### Live vs Master Tables
- Master tables (`teams`, `players`) store all data
- Live tables (`live_teams`, `live_players`) store current match config
- Allows switching matches without losing player database
- Updates to master data propagate to live data automatically

### Keyboard-Driven Workflow
- Essential for production environments where mouse is impractical
- Observer can control overlays while spectating game
- Hotkeys work even when game has focus

### Rotation Support
- Some players may have cameras mounted sideways/upside-down
- Per-player rotation allows correcting orientation
- Applied via VDO.ninja URL parameter

## Graphics & Branding
- Custom overlays designed in Photoshop (teamplates_r6hud.psd)
- Uses Chakra Petch font (futuristic tactical aesthetic)
- Orange/blue team color schemes
- Masked regions for player cameras (oppick masks)
- Professional esports aesthetic matching R6 Siege visual style

---

## Real-World Usage Insights (From Developer)

### Architecture & Production Setup
**Q: What is the typical production setup?**
- **Primary Use:** Runs on the **observer's PC** alongside Rainbow Six Siege
  - This enables native keypress capture via iohook
  - Observer controls both the game spectator and HUD overlays simultaneously
- **Alternative Setup:** Sometimes producer runs a separate instance on their network
  - Producer uses fullscreen view for talent/desk monitors
  - Observer uses ingame view for broadcast overlay
  - Both instances connect to same database for synchronization

**Q: How is the transparent overlay composited?**
- **Native transparency** - No chroma keying required!
- Browser source in OBS/vMix automatically renders as transparent overlay
- Simply position over game capture in production software
- Backup: If transparency doesn't work, use green screen underneath and key it out on receiving end

**Q: What happens if a player's webcam disconnects mid-match?**
- **Built-in fallback system:** VDO.ninja iframe becomes transparent when stream drops
- Player's **avatar image** (static photo) shows beneath the iframe
- When webcam reconnects, video feed automatically overlays the avatar again
- Seamless visual experience - no blank frames or error messages

### Performance & Latency
**Q: Is there latency between pressing a hotkey and the camera switching?**
- **Extremely fast:** Estimated **1-5ms** response time (never formally measured)
- **Faster than the game itself** - beats R6 spectator switch by 1-2 frames at 60fps
- This is critical for professional broadcasts where timing is everything

**Q: Why Node.js v13-14 specifically?**
- **Locked by iohook binary compatibility**
- Last checked, it could not be upgraded
- iohook requires native bindings compiled for specific Node versions

### Production Workflow
**Q: Do you ever use more than one view simultaneously?**
- **Yes** - Multiple views active at different times during broadcast
- Example: Ingame during matches, fullscreen for player spotlights, team views for intros

**Q: What's the VIDEO_PARAMS environment variable used for?**
- **Exactly as suspected** - Additional VDO.ninja streaming parameters
- Allows customization of stream quality, codecs, etc. without code changes

**Q: Are there any common operator errors?**
- **Not operator errors per se**
- Main issue: **R6 Siege mixes up spec positions after tech pauses**
  - Game bug, not HUD bug
  - Nothing can be done about it programmatically
  - Operators manually compensate by adjusting which keys they press
- Otherwise, system is operator-error-free in practice

### User Base & Learning Curve
**Q: Who is the target user?**
- **Broadcast companies** and **tournament organizers**
- Professional production environments, not casual streamers

**Q: What's the typical learning curve for new operators?**
- **30-60 minutes of active use** with good explanation from experienced user
- Simple enough to learn quickly
- Hotkey system is intuitive for anyone familiar with game spectating

### Compatibility & Technical Details
**Q: Have you experienced issues with iohook and R6 anti-cheat?**
- **Years since any issues**
- README guidance (DirectX, borderless, no admin) was developed from early trial and error
- **Important:** Never tested with **Siege X** (new version of game)
  - Will be needed for Siege X soon
  - May require compatibility testing

### Future Development
**Q: Are there plans to support games other than R6 Siege?**
- **Market-driven decision:** Would develop for other games if demand exists
- Currently no demand in the market developer operates in
- Architecture is relatively game-agnostic (any 5v5 or adjustable team sizes)

**Q: Would you consider adding authentication for remote admin access?**
- **Local-only is intentional** for current use case
- Future consideration: Global central server with multi-user accounts
  - Could be put behind paywall
  - SaaS model for tournament organizers
  - Not currently in development

---

## Personal Assessment

This is a **highly specialized, production-proven application** that solves a real problem in esports broadcasting. The core innovation - automatic camera switching via global hotkeys - is elegant and shows deep understanding of production workflows.

The codebase shows pragmatic development prioritizing functionality over architectural purity. It works, it's in production, and it's been released. However, there are clear opportunities for modernization and security hardening if this were to be distributed more widely or used in higher-stakes productions.

The integration of VDO.ninja is particularly clever - leveraging an existing P2P streaming solution rather than building custom WebRTC infrastructure. This is smart engineering.

Most interesting: The **dual-table architecture** (master vs live) shows thoughtful design for production environments where you need stability during live operation but flexibility between matches.

---

**Generated:** 2025-10-11  
**Analyzer:** Claude (Sonnet 4.5)  
**Developer Consultation:** Included real-world production insights  
**Security Update:** SQL injection vulnerabilities remediated  
**Purpose:** Deep project analysis and knowledge transfer

