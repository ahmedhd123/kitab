#!/bin/bash
# Railway build script
echo "Starting Railway build process..."
cd backend
echo "Installing backend dependencies..."
rm -f package-lock.json
npm install --production
echo "Build completed successfully!"
