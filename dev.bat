@echo off
setlocal

set SCRIPT_DIR=%~dp0

where bash >nul 2>nul
if %errorlevel%==0 (
    bash "%SCRIPT_DIR%dev.sh"
    goto :eof
)

where wsl >nul 2>nul
if %errorlevel%==0 (
    wsl bash "%SCRIPT_DIR%dev.sh"
    goto :eof
)

echo Neither Git Bash nor WSL was found on PATH.
echo Install Git for Windows (includes bash) or enable WSL, then re-run dev.bat.
echo Alternatively, run backend and frontend manually in two terminals:
echo   cd backend  ^&^& npm run dev
echo   cd frontend ^&^& npm run dev
exit /b 1
