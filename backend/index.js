#!/usr/bin/env node

/**
 * Railway Entry Point for Kitabi Backend
 * This file ensures Railway can find and start the correct server
 */

console.log('🚀 Starting Kitabi Backend for Railway...');
console.log('📁 Current directory:', process.cwd());
console.log('📄 Starting main server from src/server.js');

// Start the main server
require('./src/server.js');
