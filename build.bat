@echo off
echo Starting Railway build process...
cd backend
echo Installing backend dependencies...
if exist package-lock.json del package-lock.json
npm install --production
echo Build completed successfully!
