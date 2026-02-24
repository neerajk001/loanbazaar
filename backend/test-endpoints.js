const http = require('http');

const endpoints = [
    '/api/health',
    '/api/gallery/health',
    '/api/gallery/events',
    '/api/loan-products',
    '/api/loan-products/personal'
];

async function testEndpoint(port, path) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}${path}`, {
            headers: { 'x-application-source': 'ssolutions' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ port, path, status: res.statusCode, data: data.substring(0, 100) + (data.length > 100 ? '...' : '') }));
        });
        req.on('error', (e) => resolve({ port, path, error: e.message }));
    });
}

async function runTests() {
    console.log('--- Testing Ports 6000 and 6001 ---\n');
    for (const port of [6000, 6001]) {
        let success = false;
        for (const endpoint of endpoints) {
            const result = await testEndpoint(port, endpoint);
            if (result.error) {
                console.log(`Port ${port} is NOT responding to }{endpoint}. Error: ${result.error}`);
                break; // break early for this port
            } else {
                success = true;
                console.log(`✅ [PORT ${port}] ${result.path} (Status: ${result.status}) -> ${result.data}`);
            }
        }
    }
}

runTests();
