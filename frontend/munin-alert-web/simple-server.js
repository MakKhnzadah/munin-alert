const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    // Default to index.html for root
    let filePath = req.url === '/' ? 'index.html' : req.url;
    
    // Remove any query parameters
    filePath = filePath.split('?')[0];
    
    // Resolve to public directory
    filePath = path.join(__dirname, 'public', filePath);
    
    // Get file extension
    const extname = String(path.extname(filePath)).toLowerCase();
    
    // MIME types
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };
    
    const contentType = contentTypes[extname] || 'text/plain';
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // Handle OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Read file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            // If file not found, try api-test.html
            if (err.code === 'ENOENT' && req.url === '/') {
                fs.readFile(path.join(__dirname, 'public', 'api-test.html'), (err, content) => {
                    if (err) {
                        res.writeHead(500);
                        res.end(`Server Error: ${err.code}`);
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    }
                });
            } else {
                res.writeHead(404);
                res.end('File not found');
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});