@echo off
setlocal enabledelayedexpansion
title R6 HUD - Install dependencies

echo.
echo  ===============================================================
echo   R6 HUD - Dependency installation / Telepites
echo  ===============================================================
echo.
echo  Run this once after unpacking, and again after every update. It only needs an
echo  internet connection when something actually has to be installed.
echo  Ezt futtasd egyszer kicsomagolas utan, es minden frissites utan ujra. Internet
echo  csak akkor kell, ha tenyleg telepiteni kell valamit.
echo.

cd /d "%~dp0"

REM --- Node.js present? -------------------------------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo  [X] Node.js was not found on this computer.
    echo      A Node.js nincs telepitve ezen a gepen.
    echo.
    echo      Install Node.js v13.14.0 - the installer is in demo_tools\, or get it from
    echo      https://nodejs.org/dist/v13.14.0/ - then run this again. A newer Node.js will
    echo      NOT work: iohook's global-hotkey driver only has a prebuilt binary for this
    echo      exact Node version.
    echo      Telepitsd a Node.js v13.14.0-t - a telepito a demo_tools\ mappaban van, vagy
    echo      innen: https://nodejs.org/dist/v13.14.0/ - majd inditsd ujra ezt. Ujabb Node.js
    echo      NEM fog mukodni: az iohook globalis-hotkey drivere csak ehhez a pontos Node
    echo      verziohoz van leforditva.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
echo  [i] Node.js found / megtalalva: !NODE_VERSION!

REM --- Node.js in the required range? ------------------------------------------
REM iohook (global hotkeys) ships a prebuilt native binary pinned to one Node ABI, so this
REM app needs a version FLOOR *and* CEILING, unlike a normal "any newer version is fine"
REM check. The range comes from this bundle's own package.json ("engines"."node"), not two
REM numbers copied into this script by hand.
for /f "delims=" %%r in ('node -e "const s=require('./package.json').engines.node; console.log(s.match(/>=(\d+)/)[1]+' '+s.match(/<(\d+)/)[1])" 2^>nul') do set NODE_RANGE=%%r
if not defined NODE_RANGE set NODE_RANGE=13 15
for /f "tokens=1,2" %%a in ("!NODE_RANGE!") do (
    set MIN_MAJOR=%%a
    set MAX_MAJOR_EXCL=%%b
)

set NODE_MAJOR=!NODE_VERSION:v=!
for /f "tokens=1 delims=." %%m in ("!NODE_MAJOR!") do set NODE_MAJOR=%%m

if !NODE_MAJOR! LSS !MIN_MAJOR! (
    echo.
    echo  [X] Node.js !NODE_VERSION! is too old for this app. It needs a version in the
    echo      13.x-14.x range specifically, because of iohook's native hotkey driver.
    echo      A Node.js !NODE_VERSION! tul regi ehhez az alkalmazashoz. 13.x-14.x koze eso
    echo      verzio kell, az iohook nativ hotkey drivere miatt.
    echo.
    pause
    exit /b 1
)
if !NODE_MAJOR! GEQ !MAX_MAJOR_EXCL! (
    echo.
    echo  [X] Node.js !NODE_VERSION! is too NEW for this app. iohook's global-hotkey driver
    echo      is a prebuilt native binary that only exists for Node 13.x-14.x - a newer
    echo      Node.js will install, but the app will crash the moment it starts. Uninstall
    echo      this Node.js and install v13.14.0 instead - the installer is in demo_tools\.
    echo      A Node.js !NODE_VERSION! tul UJ ehhez az alkalmazashoz. Az iohook nativ hotkey
    echo      drivere csak 13.x-14.x Node-hoz letezik - egy ujabb Node.js feltelepul, de az
    echo      alkalmazas azonnal elszall inditaskor. Tavolitsd el ezt a Node.js-t, es
    echo      telepitsd helyette a v13.14.0-t - a telepito a demo_tools\ mappaban van.
    echo.
    pause
    exit /b 1
)

REM --- Does anything actually need installing? -----------------------------------
REM A stamp file records the SHA-256 of package-lock.json from the last successful
REM install. If node_modules exists and the lockfile has not changed since, there is
REM nothing to do - safe to run this after every update: unpacking one with unchanged
REM dependencies costs nothing, and one with new or updated packages installs only
REM what changed.
set "STAMP=node_modules\.install-stamp.txt"
set "LOCK_HASH="
for /f "skip=1 tokens=1" %%h in ('certutil -hashfile package-lock.json SHA256 2^>nul ^| findstr /v /i "hash CertUtil"') do if not defined LOCK_HASH set LOCK_HASH=%%h

set NEED_INSTALL=1
if exist "node_modules" if exist "!STAMP!" if defined LOCK_HASH (
    set /p STAMPED_HASH=<"!STAMP!"
    if "!LOCK_HASH!"=="!STAMPED_HASH!" set NEED_INSTALL=0
)

if !NEED_INSTALL! EQU 0 (
    echo.
    echo  ===============================================================
    echo   [OK] Dependencies are already installed and up to date.
    echo        A fuggosegek mar telepitve es naprakeszek. Nincs mit tenni.
    echo  ===============================================================
    echo.
    pause
    exit /b 0
)

echo.
if exist "node_modules" (
    echo  [i] An update is available. Updating dependencies, this can take a few minutes...
    echo      Van egy frissites. Fuggosegek frissitese, ez eltarthat par percig...
) else (
    echo  [i] Installing packages, this can take a few minutes...
    echo      Csomagok telepitese, ez eltarthat par percig...
)
echo.

call npm ci --omit=dev
if errorlevel 1 (
    echo.
    echo  [!] 'npm ci' failed, retrying with 'npm install'...
    echo      Az 'npm ci' nem sikerult, ujraprobalas 'npm install' paranccsal...
    echo.
    call npm install --omit=dev
    if errorlevel 1 (
        echo.
        echo  [X] Installation failed. Check your internet connection and try again.
        echo      If iohook specifically fails to build or download a binary, this Node.js
        echo      version does not have a prebuilt driver available - see above.
        echo      A telepites nem sikerult. Ellenorizd az internetkapcsolatot.
        echo      Ha kifejezetten az iohook telepitese buk el, ehhez a Node.js verziohoz
        echo      nincs eloreforditott driver - lasd feljebb.
        echo.
        pause
        exit /b 1
    )
)

REM Record what was just installed so the next run can tell nothing has changed.
set "LOCK_HASH="
for /f "skip=1 tokens=1" %%h in ('certutil -hashfile package-lock.json SHA256 2^>nul ^| findstr /v /i "hash CertUtil"') do if not defined LOCK_HASH set LOCK_HASH=%%h
if defined LOCK_HASH echo !LOCK_HASH!> "%STAMP%"

echo.
echo  ===============================================================
echo   [OK] Done. You can now start the app with run.bat
echo        Kesz. Az alkalmazast a run.bat inditja.
echo  ===============================================================
echo.
pause
endlocal
