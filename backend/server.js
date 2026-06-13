const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const http = require('http');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tokens', require('./routes/tokens'));
app.use('/api/whales', require('./routes/whales'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/alerts', require('./routes/alerts'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// WebSocket connection for real-time data
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 WebSocket running on port ${process.env.WS_PORT || 5001}`);
});

module.exports = { app, wss };
