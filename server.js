const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const https = require('https');
const url = require('url');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// API Keys from environment variables
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle API proxy requests
    if (pathname === '/api/weather') {
        handleWeatherRequest(req, res, parsedUrl.query);
        return;
    } else if (pathname === '/api/recommendation') {
        handleRecommendationRequest(req, res);
        return;
    } else if (pathname === '/api/geocode') {
        handleGeocodeRequest(req, res, parsedUrl.query);
        return;
    }

    // Get file path
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Get file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Set proper content type
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
            contentType = 'image/jpg';
            break;
    }

    // Inject WebSocket client code if it's an HTML file
    if (contentType === 'text/html') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }

            // Inject live reload script before </body>
            const liveReloadScript = `
                <script>
                    // LiveReload WebSocket connection
                    const socket = new WebSocket('ws://localhost:8081');
                    socket.onopen = () => console.log('Connected to live reload server');
                    socket.onmessage = (msg) => {
                        if (msg.data === 'reload') {
                            console.log('Reloading page...');
                            window.location.reload();
                        }
                    };
                    socket.onclose = () => console.log('Disconnected from live reload server');
                </script>
            `;
            
            const modifiedData = data.replace('</body>', `${liveReloadScript}</body>`);
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(modifiedData);
        });
    } else {
        // Serve other file types normally
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    }
});

// Handle Weather API proxy request
function handleWeatherRequest(req, res, query) {
    const city = query.city;
    const lang = query.lang || 'en'; // Default to English if no language specified
    
    if (!city) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'City parameter is required' }));
        return;
    }

    // Add language parameter to the API request
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=${lang}&appid=${WEATHER_API_KEY}`;
    
    https.get(weatherUrl, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }).on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch weather data' }));
    });
}

// Handle geocode API proxy request
function handleGeocodeRequest(req, res, query) {
    const { lat, lon } = query;
    if (!lat || !lon) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Latitude and longitude parameters are required' }));
        return;
    }

    const geocodeUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${WEATHER_API_KEY}`;
    
    https.get(geocodeUrl, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        
        response.on('end', () => {
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    }).on('error', (err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to fetch geocode data' }));
    });
}

// Handle clothing recommendation API proxy request
function handleRecommendationRequest(req, res) {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            const openaiUrl = 'https://api.openai.com/v1/chat/completions';
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            };
            
            const openaiReq = https.request(openaiUrl, options, (openaiRes) => {
                let responseData = '';
                openaiRes.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                openaiRes.on('end', () => {
                    res.writeHead(openaiRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(responseData);
                });
            });
            
            openaiReq.on('error', (err) => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to fetch recommendation' }));
            });
            
            openaiReq.write(JSON.stringify(data));
            openaiReq.end();
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
    });
}

// Create WebSocket server for live reload
const wss = new WebSocket.Server({ port: 8081 });
console.log('WebSocket server running on port 8081');

// Store all connected clients
const clients = new Set();

// Handle new connections
wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected');
    
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

// Watch files for changes
const watchFiles = (dir) => {
    fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            console.log(`File changed: ${filename}`);
            // Notify all clients to reload
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('reload');
                }
            });
        }
    });
};

// Start server on port 8080
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Live reload enabled');
    
    // Watch current directory for changes
    watchFiles('.');
}); 