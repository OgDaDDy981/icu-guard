@echo off
title ICU GUARD - Medical Telemetry & Discrete Mathematics Simulation
color 0B
cls

echo ===============================================================================
echo                                 ICU GUARD
echo                 THE SCIENCE OF EVERY SECOND : SIMULATION
echo                Discrete Mathematics (Unit 2) Presentation
echo ===============================================================================
echo.

:: Ensure we are in the script's directory
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js was not detected on your system PATH!
    echo Please install Node.js from https://nodejs.org/ to run ICU GUARD.
    echo.
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [*] First time setup detected. Installing dependencies...
    echo.
    call npm.cmd install
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

:: Check if dist folder exists, if not build it
if not exist "dist\" (
    echo [*] Building production bundle...
    echo.
    call npm.cmd run build
    if %ERRORLEVEL% neq 0 (
        color 0C
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
)

echo.
echo ===============================================================================
echo  [+] ICU GUARD Telemetry Engine is starting on: http://localhost:5173
echo  [+] Launching your default web browser automatically...
echo ===============================================================================
echo.

:: Launch web browser after a brief 1.5s delay in background
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173"

:: Start the production preview server (fast, reliable, identical to evaluation)
call npm.cmd run preview -- --port 5173

pause
