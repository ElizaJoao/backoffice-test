@echo off
echo Stopping any running Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Deleting old database...
if exist database.sqlite del /F database.sqlite
if exist src\database.sqlite del /F src\database.sqlite

echo Database deleted successfully!
echo.
echo Now run: npm run seed
echo Then run: npm run dev
pause
