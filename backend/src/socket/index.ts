import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: '*', // Allow all origins (adjust for production)
        },
    });

    // Handle new WebSocket connections
    io.on('connection', (socket: Socket) => {
        const { authorization } = socket.handshake.headers; // Extract the token from the headers

        if (authorization) {
            try {
                const jwtSecret = process.env.JWT_SECRET || ''; // JWT secret from environment
                const decodedToken = jwt.verify(authorization, jwtSecret); // Verify token

                if (!decodedToken) {
                    socket.emit('connection-response', {
                        type: 'error',
                        is_token_expire: true,
                        message: 'Invalid token',
                    });
                    socket.disconnect();
                    return;
                }
            } catch (error) {
                handleJwtError(error, socket); // Handle JWT-related errors
                return;
            }

            const socketurl = process.env.SOCKET_CONNECTION_URL ?? ''; // WebSocket URL from env
            const ws = new WebSocket(socketurl);

            // WebSocket opened
            ws.on('open', () => {
                console.log('WebSocket connection opened.');
            });

            // Subscribe to messages
            socket.on('subscribe', (message:any) => {
                handleSubscription(ws, socket, message);
            });

            // Unsubscribe from messages
            socket.on('unsubscribe', (message:any) => {
                handleUnsubscription(ws, socket, message);
            });

            // Forward WebSocket messages to the client
            ws.onmessage = (event: any) => {
                const data = JSON.parse(event.data);
                if (data.data?.e === 'trade') {
                    socket.emit('ticker', data, (error: any) => {
                        if (error) console.error('Error sending ticker:', error);
                    });
                }
            };

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('Client disconnected.');
            });

        } else {
            // Disconnect if no token is provided
            socket.disconnect();
        }
    });
};

// Handle subscription requests
const handleSubscription = (ws: WebSocket, socket: Socket, message: any) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: message.type,
            params: message?.channels,
            id: 1, // Unique request ID (should be dynamic)
        }), (error) => {
            if (error) {
                socket.emit('connection-response', {
                    type: 'error',
                    is_token_expire: false,
                    message: 'Subscription failed',
                });
            } else {
                socket.emit('connection-response', {
                    type: 'success',
                    is_token_expire: false,
                    message: 'Subscription successful',
                });
            }
        });
    } else {
        socket.emit('connection-response', {
            type: 'error',
            is_token_expire: false,
            message: 'WebSocket not open yet. Subscription queued.',
        });
    }
};

// Handle unsubscription requests
const handleUnsubscription = (ws: WebSocket, socket: Socket, message: any) => {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            method: message.type,
            params: message?.channels,
            id: 1, // Unique request ID (should be dynamic)
        }), (error) => {
            if (error) {
                socket.emit('connection-response', {
                    type: 'error',
                    is_token_expire: false,
                    message: 'Unsubscription failed',
                });
            } else {
                socket.emit('connection-response', {
                    type: 'success',
                    is_token_expire: false,
                    message: 'Unsubscription successful',
                });
            }
        });
    } else {
        socket.emit('connection-response', {
            type: 'error',
            is_token_expire: false,
            message: 'WebSocket not open. Unsubscription failed.',
        });
    }
};

// Handle JWT errors
const handleJwtError = (error: any, socket: Socket) => {
    if (error instanceof Error) {
        const errorMessage = error.name === 'TokenExpiredError'
            ? 'Token has expired'
            : error.name === 'JsonWebTokenError'
            ? 'Invalid token format'
            : 'An error occurred while verifying the token';

        socket.emit('connection-response', {
            type: 'error',
            is_token_expire: true,
            message: errorMessage,
        });

        console.error('JWT verification error:', error.message);
    } else {
        socket.emit('connection-response', {
            type: 'error',
            is_token_expire: true,
            message: 'An unknown error occurred',
        });
        console.error('Unknown error:', error);
    }

    socket.disconnect(); // Disconnect client on JWT error
};
