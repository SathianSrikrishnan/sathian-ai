@echo off
setlocal
cd /d "%~dp0"

set PYTHON_EXE=C:\Users\sathi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe
set HOST_IP=192.168.1.105
set PREVIEW_PATH=/toothfairy/animation/tanda-hero-mobile-review-v22.html

echo.
echo Tooth Fairy Network - Tanda Preview
echo.
echo Desktop:
echo   http://127.0.0.1:3000%PREVIEW_PATH%
echo.
echo Phone on the same Wi-Fi:
echo   http://%HOST_IP%:3000%PREVIEW_PATH%
echo.
echo Keep this window open while reviewing. Press Ctrl+C to stop.
echo.

start "" "http://127.0.0.1:3000%PREVIEW_PATH%"
"%PYTHON_EXE%" -m http.server 3000 --bind 0.0.0.0 --directory public
