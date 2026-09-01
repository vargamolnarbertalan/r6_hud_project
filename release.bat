@echo off
REM Quick local bundle for testing. For an actual release, push a vX.Y.Z tag instead -
REM .github/workflows/release.yml builds and publishes the real ZIP (see docs/adr/0001).
REM
REM Deliberately does NOT include .env - it was in this list before and every ZIP built with
REM it shipped the real database password. Ship env.template; the operator fills in their own.
if exist _release rmdir /s /q _release
mkdir _release
bestzip _release\r6hud_local_test.zip public views env.template install_dependencies.bat run.bat package.json package-lock.json README.md LICENSE misc\r6_hud.sql
