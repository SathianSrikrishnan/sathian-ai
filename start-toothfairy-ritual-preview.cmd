@echo off
cd /d "%~dp0"
echo Tooth Fairy ritual preview
echo.
echo Desktop:
echo   http://127.0.0.1:3000/toothfairy/ritual
echo   http://127.0.0.1:3000/toothfairy?ritual=1
echo   http://127.0.0.1:3000/animation/tanda-hero-ritual
echo   http://127.0.0.1:3000/toothfairy/animation/tfn-tanda-hero-integrated-v34-review.html
echo.
echo Phone on the same Wi-Fi:
echo   http://192.168.1.105:3000/toothfairy/ritual
echo   http://192.168.1.105:3000/animation/tanda-hero-ritual
echo   http://192.168.1.105:3000/toothfairy/animation/tfn-tanda-hero-integrated-v34-review.html
echo.
echo Leave this window open while testing.
echo.
node.exe node_modules\next\dist\bin\next start -H 0.0.0.0 -p 3000
pause
