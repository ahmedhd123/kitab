#!/bin/bash

echo "Starting MongoDB with network access..."

# Create data directory if it doesn't exist
mkdir -p data/db

# Start MongoDB with network binding
echo "Starting MongoDB server..."
echo "MongoDB will be accessible from any network interface on port 27017"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed or not in PATH"
    echo "Please install MongoDB first:"
    echo "- Ubuntu/Debian: sudo apt-get install mongodb"
    echo "- CentOS/RHEL: sudo yum install mongodb"
    echo "- macOS: brew install mongodb"
    exit 1
fi

# Start MongoDB
mongod --dbpath="data/db" --bind_ip 0.0.0.0 --port 27017 --logpath="data/mongodb.log" --logappend
