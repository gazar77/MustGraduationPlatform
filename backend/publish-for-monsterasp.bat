@echo off
setlocal
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0publish-for-monsterasp.ps1"
set EXITCODE=%ERRORLEVEL%
if %EXITCODE% neq 0 (
  echo Publish failed with exit code %EXITCODE%.
  pause
  exit /b %EXITCODE%
)
echo.
pause
