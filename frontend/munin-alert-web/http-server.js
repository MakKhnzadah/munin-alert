// http-server.js - A simple HTTP server for testing the Munin Alert API
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

console.log('Starting HTTP server for Munin Alert testing...');
console.log(`Serving files from: ${PUBLIC_DIR}`);

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Handle favicon requests
    if (req.url === '/favicon.ico') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // Default to api-test.html for root requests
    let filePath = req.url === '/' 
        ? path.join(PUBLIC_DIR, 'api-test.html') 
        : path.join(PUBLIC_DIR, req.url);
    
    // Get file extension
    const extname = path.extname(filePath);
    
    // Default content type
    let contentType = 'text/html';
    
    // Set content type based on file extension
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
    }
    
    // Read file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                console.error(`File not found: ${filePath}`);
                fs.readFile(path.join(PUBLIC_DIR, '404.html'), (err, content) => {
                    if (err) {
                        // No 404 page found
                        res.writeHead(404);
                        res.end('404 Not Found');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    }
                });
            } else {
                // Server error
                console.error(`Server error: ${err.code}`);
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

// Explicitly listen on all interfaces (0.0.0.0)
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`API test page: http://localhost:${PORT}/api-test.html`);
    console.log(`CORS test page: http://localhost:${PORT}/cors-test.html`);
    console.log('Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please close the application using it or choose a different port.`);
    }
});