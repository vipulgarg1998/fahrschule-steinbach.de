@echo off
cd /d "%~dp0"
set "SITE_PORT=4173"

where py >nul 2>nul
if %errorlevel%==0 (
  start "Fahrschule Preview Server" py -3 -m http.server %SITE_PORT%
) else (
  start "Fahrschule Preview Server" python -m http.server %SITE_PORT%
)

timeout /t 1 /nobreak >nul
start "" "http://localhost:%SITE_PORT%"

echo The preview server is running in a separate window.
echo Save schedule.csv and refresh the browser to see changes.
