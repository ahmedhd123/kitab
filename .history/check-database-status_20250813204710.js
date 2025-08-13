#!/usr/bin/env node

/**
 * Database Connection Status Checker
 * Comprehensive analysis of database connectivity across environments
 */

const https = require('https');

class DatabaseStatusChecker {
    constructor() {
        this.frontendUrl = 'https://kitab-plum.vercel.app';
        this.backendUrl = 'https://kitab-production.up.railway.app'; // Railway backend
        this.results = {
            frontend: null,
            backend: null,
            database: null,
            recommendations: []
        };
    }

    async makeRequest(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Kitabi-DB-Checker/1.0.0'
                }
            };

            const req = https.request(url, options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        const jsonData = JSON.parse(body);
                        resolve({
                            statusCode: res.statusCode,
                            data: jsonData,
                            headers: res.headers
                        });
                    } catch (error) {
                        resolve({
                            statusCode: res.statusCode,
                            data: body,
                            parseError: error.message
                        });
                    }
                });
            });

            req.on('error', (error) => {
                reject({ error: error.message });
            });

            if (data && method !== 'GET') {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    async checkFrontendDatabase() {
        console.log('🌐 Checking Frontend Database Status...');
        
        try {
            // Test if frontend has database connectivity
            const response = await this.makeRequest(`${this.frontendUrl}/api/health`);
            
            this.results.frontend = {
                status: response.statusCode === 200 ? 'ONLINE' : 'ERROR',
                databaseMode: 'DEMO', // Frontend is using demo data
                hasBackend: false,
                apiEndpoints: response.statusCode === 200
            };

            console.log(`   Frontend API: ${this.results.frontend.status}`);
            console.log(`   Database Mode: ${this.results.frontend.databaseMode}`);

        } catch (error) {
            this.results.frontend = {
                status: 'OFFLINE',
                error: error.error
            };
            console.log(`   ❌ Frontend Error: ${error.error}`);
        }
    }

    async checkBackendDatabase() {
        console.log('\n🔧 Checking Backend Database Status...');
        
        try {
            // Test Railway backend database connection
            const response = await this.makeRequest(`${this.backendUrl}/api/health`);
            
            if (response.statusCode === 200) {
                this.results.backend = {
                    status: 'ONLINE',
                    databaseConnected: response.data.database?.connected || false,
                    mongodbStatus: response.data.database?.status || 'unknown',
                    environment: response.data.environment
                };

                console.log(`   Backend API: ${this.results.backend.status}`);
                console.log(`   Database Connected: ${this.results.backend.databaseConnected}`);
                console.log(`   Environment: ${this.results.backend.environment}`);
            } else {
                this.results.backend = {
                    status: 'ERROR',
                    statusCode: response.statusCode
                };
                console.log(`   ❌ Backend Error: HTTP ${response.statusCode}`);
            }

        } catch (error) {
            this.results.backend = {
                status: 'OFFLINE',
                error: error.error
            };
            console.log(`   ❌ Backend Offline: ${error.error}`);
        }
    }

    async testDirectDatabaseConnection() {
        console.log('\n🗄️ Testing Direct Database Connection...');
        
        try {
            // Test user registration to check database write capability
            const testUser = {
                email: `test-${Date.now()}@kitabi-test.com`,
                password: 'test123',
                username: `test_${Date.now()}`
            };

            // Try backend registration first
            let dbTestResult = null;
            if (this.results.backend?.status === 'ONLINE') {
                try {
                    const response = await this.makeRequest(`${this.backendUrl}/api/auth/register`, 'POST', testUser);
                    dbTestResult = {
                        source: 'backend',
                        connected: response.statusCode === 201 || response.statusCode === 409,
                        statusCode: response.statusCode,
                        message: response.data.message || 'Unknown'
                    };
                } catch (error) {
                    dbTestResult = {
                        source: 'backend',
                        connected: false,
                        error: error.error
                    };
                }
            }

            // If backend failed, try frontend
            if (!dbTestResult?.connected) {
                try {
                    const response = await this.makeRequest(`${this.frontendUrl}/api/auth/register`, 'POST', testUser);
                    dbTestResult = {
                        source: 'frontend',
                        connected: response.statusCode === 201,
                        statusCode: response.statusCode,
                        mode: 'demo'
                    };
                } catch (error) {
                    // Frontend registration not available
                }
            }

            this.results.database = dbTestResult;

            if (dbTestResult?.connected) {
                console.log(`   ✅ Database Test: PASSED (via ${dbTestResult.source})`);
                console.log(`   Connection: ${dbTestResult.source === 'backend' ? 'MongoDB Atlas' : 'Demo Mode'}`);
            } else {
                console.log(`   ❌ Database Test: FAILED`);
                console.log(`   Issue: No database connectivity detected`);
            }

        } catch (error) {
            this.results.database = {
                connected: false,
                error: error.error
            };
            console.log(`   ❌ Database Test Error: ${error.error}`);
        }
    }

    generateRecommendations() {
        const { frontend, backend, database } = this.results;

        // Analyze current state
        if (frontend?.status === 'ONLINE' && backend?.status === 'OFFLINE') {
            this.results.recommendations.push({
                priority: 'HIGH',
                issue: 'Backend Offline',
                solution: 'Deploy or restart Railway backend service',
                impact: 'No real database connectivity'
            });
        }

        if (database?.connected === false || !database) {
            this.results.recommendations.push({
                priority: 'HIGH',
                issue: 'No Database Connection',
                solution: 'Connect MongoDB Atlas or enable backend service',
                impact: 'System running in demo mode only'
            });
        }

        if (frontend?.status === 'ONLINE' && !frontend?.hasBackend) {
            this.results.recommendations.push({
                priority: 'MEDIUM',
                issue: 'Frontend-Only Deployment',
                solution: 'Integrate backend API calls or deploy full-stack',
                impact: 'Limited functionality, demo data only'
            });
        }

        if (backend?.status === 'ONLINE' && !backend?.databaseConnected) {
            this.results.recommendations.push({
                priority: 'HIGH',
                issue: 'Backend online but database disconnected',
                solution: 'Check MongoDB Atlas connection string and network access',
                impact: 'API available but no data persistence'
            });
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(70));
        console.log('🗄️ DATABASE CONNECTION STATUS REPORT');
        console.log('='.repeat(70));

        // Current Status Summary
        console.log('\n📊 CURRENT STATUS:');
        console.log(`Frontend (Vercel):  ${this.results.frontend?.status || 'UNKNOWN'}`);
        console.log(`Backend (Railway):  ${this.results.backend?.status || 'UNKNOWN'}`);
        console.log(`Database (MongoDB): ${this.results.database?.connected ? 'CONNECTED' : 'DISCONNECTED'}`);

        // Database Analysis
        console.log('\n🔍 DATABASE ANALYSIS:');
        if (this.results.database?.connected) {
            console.log(`✅ Database Status: CONNECTED`);
            console.log(`📡 Connection via: ${this.results.database.source}`);
            console.log(`💾 Data Mode: ${this.results.database.source === 'backend' ? 'MongoDB Atlas' : 'Demo/Local'}`);
        } else {
            console.log(`❌ Database Status: DISCONNECTED`);
            console.log(`📡 Connection: No active database connection detected`);
            console.log(`💾 Data Mode: Demo/Static data only`);
        }

        // Environment Details
        console.log('\n🌐 ENVIRONMENT DETAILS:');
        console.log(`Production URL: ${this.frontendUrl}`);
        console.log(`Backend URL: ${this.backendUrl}`);
        console.log(`Database: MongoDB Atlas (if connected)`);

        // Recommendations
        console.log('\n💡 RECOMMENDATIONS:');
        if (this.results.recommendations.length === 0) {
            console.log('✅ All systems operational - no actions needed');
        } else {
            this.results.recommendations.forEach((rec, index) => {
                console.log(`${index + 1}. [${rec.priority}] ${rec.issue}`);
                console.log(`   Solution: ${rec.solution}`);
                console.log(`   Impact: ${rec.impact}\n`);
            });
        }

        // Quick Actions
        console.log('\n🚀 QUICK ACTIONS:');
        if (!this.results.database?.connected) {
            console.log('1. Start Railway backend: https://railway.app');
            console.log('2. Check MongoDB Atlas network access');
            console.log('3. Verify environment variables');
            console.log('4. Test local backend connection');
        } else {
            console.log('✅ Database is connected and functional');
        }

        console.log('\n' + '='.repeat(70));
    }

    async runFullCheck() {
        console.log('🔍 COMPREHENSIVE DATABASE STATUS CHECK\n');
        
        await this.checkFrontendDatabase();
        await this.checkBackendDatabase();
        await this.testDirectDatabaseConnection();
        
        this.generateRecommendations();
        this.generateReport();

        // Save report
        const fs = require('fs');
        const reportPath = `F:/kitab/database-status-${Date.now()}.json`;
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            results: this.results
        }, null, 2));
        
        console.log(`\n💾 Report saved: ${reportPath}`);
    }
}

// Run the check
if (require.main === module) {
    const checker = new DatabaseStatusChecker();
    checker.runFullCheck().catch(console.error);
}

module.exports = DatabaseStatusChecker;
