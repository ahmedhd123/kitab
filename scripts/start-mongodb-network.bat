@echo off
echo Starting MongoDB with network access...

REM Create data directory if it doesn't exist
if not exist "data\db" mkdir "data\db"

REM Start MongoDB with network binding
REM --bind_ip 0.0.0.0 allows connections from any IP
REM --bind_ip_all is an alternative to bind to all interfaces
REM --port 27017 is the default port

echo Starting MongoDB server...
echo MongoDB will be accessible from any network interface on port 27017
echo.

mongod --dbpath="data\db" --bind_ip 0.0.0.0 --port 27017 --logpath="data\mongodb.log" --logappend

pause
