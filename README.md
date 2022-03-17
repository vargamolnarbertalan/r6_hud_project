# R6 HUD caminsert by B3RC1
This node.js app allows you to integrate playercams into your R6S broadcast, including several standalone view templates and ingame insert so when the observer switches spectate position, the live feed of the player will be switched too.

# System requirements
- Only Windows OS.
- You need to have Node.js (v16.14.1 or newer) installed: https://nodejs.dev/
- Strong PC recommended if you wish to run all views smoothly at once ON PRODUCTION PC.

# Installation
- Clone repository or download and unpack zip.

# Using the application
- This app should be used on the observer PC where from you can forward only the insert-overlay as a transparent signal (for example via NDI) or mix together with game feed and forward that (for example via RTMP). If you can't use transparent signal, put a plain green color under the browsersources and keyout the green on recieving end or crop/mask the non-transparent feed.
- Start the app by running 'run.bat'. In the console enter the database provider's public IPv4 address. If the database server is running on your machine, you should enter localhost here. If you have the database set up correctly, the app (nodejs server) will start and you will recieve links to access both config and view pages.
- Start the compiled autohotkey script by running 'run_hotkey.exe', this script will always send keystrokes to the app even when an other window (for example the game) is focused.

# Hotkeys
- Select spectate postions (effects ingame and fullscreen views): 1,2,3,4,5,6,7,8,9,ö
- Hide or show ingame overlay (effects ingame view): c
- Force refresh (effects all views): f10
- Force hide (effects ingame view): f11
- Force show (effects ingame view): f12

# Good to know
- When you successfully update the match on /match_control page all the views will be force refreshed automatically.
- When you successfully edit/delete a player or team, the live views will be refreshed and updated accordingly automatically, immediately.
