# R6 HUD caminsert by B3RC1
This node.js app allows you to integrate playercams into your R6S broadcast, including several standalone view templates and ingame insert so when the observer switches spectate position, the live feed of the player will be switched too.

# System requirements
- Only Windows OS.
- You need to have Node.js installed (v13-14 | pack contains installer for v13.14.0).
- Strong PC recommended if you wish to run all views smoothly at once ON PRODUCTION PC.
- Hungarian or English (US) keyboard layout needed.

# Installation
- Clone repository or download and unpack zip.
- Install Node.js v13.14.0 by running 'node-v13.14.0-x64.msi' or via nvm.
- Inside the app's folder execute 'install_dependencies.bat' or run 'npm install' in terminal.
- Create a .env file in the app's folder and declare DB_HOST, DB_PORT, DB_USER, DB_PASSWORD and DB_NAME variables.

# Using the application
- This app should be used on the observer PC from where you can forward only the insert-overlay as a transparent signal (for example via NDI) or mix together with game feed and forward that (for example via RTMP). If you can't use transparent signal, put a plain green color under the browsersources and key out the green on the recieving end or crop/mask the non-transparent feed.
- __Start__ the app by running 'run.bat'. If you have the database connection details stored correctly in the '.env' file, the app (nodejs server) will start and you will recieve links to access both config and view pages.

# Hotkeys
- Select spectate positions (effects ingame and fullscreen views): 1,2,3,4,5,6,7,8,9,ö on Hungarian keyboard, 0 on English (US) keyboard.
- Show ingame overlay (effects ingame view): X
- Hide ingame overlay (effects ingame view): C
- Force refresh (effects all views): ALT + R
- Force hide (effects ingame view): ALT + H
- Force show (effects ingame view): ALT + S

# Good to know
- When you successfully update the match on /match_control page all the views will be force refreshed automatically.
- When you successfully edit/delete a player or team, the live views will be refreshed and updated accordingly automatically, immediately.
- It's best to start the hud app first and then whichever production program you're using, otherwise you might have to manually reset browser inputs inside production app after starting the hud server.
- The app supposed to work both with R6 fullscreen/borderless, vulkan and DX, starting the game with or without admin permissions shouldn't matter, but as always new R6 patches can have a negative impact on this app so if you experience that, please run DirectX version of R6 in borderless mode, without admin rights.
- Max DISPLAY length for nickname: 13 capital M (you can enter longer nicks than 13 characters)
- Max DISPLAY length for fullname: 22 capital M (you can enter longer names than 22 characters)
