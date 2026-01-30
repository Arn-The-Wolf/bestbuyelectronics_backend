import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

const clients = new Map();

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    // Extract token from query or headers
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      ws.userId = decoded.userId;
      clients.set(decoded.userId, ws);

      console.log(`Client connected: ${decoded.userId}`);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);

          if (data.type === 'typing') {
            // Relay typing status to specific receiver
            if (data.receiverId) {
              const receiverWs = clients.get(data.receiverId);
              if (receiverWs && receiverWs.readyState === 1) {
                receiverWs.send(JSON.stringify({
                  type: 'typing',
                  senderId: decoded.userId,
                  isTyping: data.isTyping
                }));
              }
            }
          }
          // Potential for other message types here
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        clients.delete(decoded.userId);
        console.log(`Client disconnected: ${decoded.userId}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(decoded.userId);
      });
    } catch (error) {
      ws.close(1008, 'Invalid token');
    }
  });

  console.log('WebSocket server initialized');
}

function broadcastMessage(data, senderId) {
  const message = {
    ...data,
    sender_id: senderId,
    timestamp: new Date().toISOString()
  };

  // Broadcast to all connected clients
  clients.forEach((client, userId) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
}

export function notifyClients(event, data) {
  const message = {
    event,
    data,
    timestamp: new Date().toISOString()
  };

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

