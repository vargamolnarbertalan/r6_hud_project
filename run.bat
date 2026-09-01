@echo off
setlocal
title R6 HUD

REM Entry point for the observer/operator. Starts the server, which serves both the
REM config pages (/admin, /match_control, /readiness-scan) and the broadcast views
REM (/ingame, /fullscreen, etc.), then opens the readiness scan in the default browser.
REM DO NOT CLOSE this window while you are on air - closing it stops every open view.

set HTTP_PORT=8083
set WS_PORT=6969
set HOST=127.0.0.1

cd /d "%~dp0"

echo.
echo  ===============================================================
echo   R6 HUD
echo  ===============================================================
echo.
echo   Keep this window open while broadcasting.
echo   Hagyd nyitva ezt az ablakot a kozvetites alatt.
echo.

REM --- Prerequisites ----------------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo  [X] Node.js was not found. Run install_dependencies.bat first.
    echo      A Node.js nem talalhato. Futtasd eloszor az install_dependencies.bat fajlt.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo  [X] Dependencies are not installed. Run install_dependencies.bat first.
    echo      A fuggosegek nincsenek telepitve. Futtasd eloszor az install_dependencies.bat fajlt.
    echo.
    pause
    exit /b 1
)

if not exist ".env" (
    echo  [X] .env was not found.
    echo      A .env fajl hianyzik.
    echo.
    echo      Copy env.template to .env and fill in your database details, then run this again.
    echo      Masold at az env.template-et .env nevre es told ki az adatbazis adataiddal,
    echo      majd inditsd ujra ezt.
    echo.
    pause
    exit /b 1
)

REM --- Are the ports already taken? --------------------------------------------
REM Catching this here gives a clear message instead of a stack trace or a silently dead
REM WebSocket server; the most common cause is a second copy of this app already running.
set PORT_BUSY=
netstat -ano | findstr /r /c:"LISTENING" | findstr /c:":%HTTP_PORT% " >nul 2>nul
if not errorlevel 1 set PORT_BUSY=%HTTP_PORT%
netstat -ano | findstr /r /c:"LISTENING" | findstr /c:":%WS_PORT% " >nul 2>nul
if not errorlevel 1 if not defined PORT_BUSY set PORT_BUSY=%WS_PORT%

if defined PORT_BUSY (
    echo  [X] Port %PORT_BUSY% is already in use.
    echo      A %PORT_BUSY% port mar foglalt.
    echo.
    echo      Another copy of R6 HUD is probably already running. Close that window first.
    echo      Valoszinuleg mar fut egy masik peldany. Zard be azt az ablakot eloszor.
    echo.
    pause
    exit /b 1
)

REM --- Open the readiness scan once the server is up ---------------------------
REM Fired in the background so the browser opens only once the HTTP port actually answers,
REM rather than after an arbitrary sleep that is either too short or wastes time.
start "" /b cmd /c "for /l %%i in (1,1,60) do (curl -s -o nul http://%HOST%:%HTTP_PORT%/readiness-scan && (start "" http://%HOST%:%HTTP_PORT%/readiness-scan & exit) || timeout /t 1 /nobreak >nul)"

echo  [i] Starting server on http://%HOST%:%HTTP_PORT%
echo.
echo      Readiness scan   http://%HOST%:%HTTP_PORT%/readiness-scan   (run before going live)
echo      Admin            http://%HOST%:%HTTP_PORT%/admin
echo      Match control    http://%HOST%:%HTTP_PORT%/match_control
echo.

node --no-warnings server.js

REM Reached only when the server stops.
echo.
echo  [i] R6 HUD has stopped. / Az alkalmazas leallt.
pause
endlocal
