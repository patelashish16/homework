import express, { Express } from 'express';

import compression from 'compression';
import cors from 'cors'
import dotenv from 'dotenv';
import http from 'http';
import statusCodes from 'http-status-codes';
import routes from './src/routes/Auth';
import { Server, Socket } from "socket.io";
import WebSocket from "ws";
import jwt from 'jsonwebtoken';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3003;
const socketurl = process.env.SOCKET_CONNECTION_URL ?? ""

app.use(express.json());
app.use(compression({ level: 6, threshold: 0 }));
app.use(cors());


const server = http.createServer(app);


// setup socket handlers
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', (socket: Socket) => {

    const { authorization } = socket.handshake.headers; // get access toke from user side
    // Confirm jwt token
    if (authorization) {
        try {
            // verify token is valid or not 
            const jwtSecret = process.env.JWT_SECRET ?? "";
            let res = jwt.verify(authorization,jwtSecret)
            if (!res) {
                socket.emit('connection-response', {
                    type:'error',
                    is_token_expire:true,
                    message: 'Invalid token',
                });
                socket.disconnect()
                return
            }
        } catch (error) {
            if (error instanceof Error) {
                // Handle specific JWT errors
                if (error.name === 'TokenExpiredError') {
                    socket.emit('connection-response', {
                        type: 'error',
                        is_token_expire:true,
                        message: 'Token has expired',
                    });
                } else if (error.name === 'JsonWebTokenError') {
                    socket.emit('connection-response', {
                        type: 'error',
                        is_token_expire:true,
                        message: 'Invalid token format',
                    });
                } else {
                    socket.emit('connection-response', {
                        type: 'error',
                        is_token_expire:true,
                        message: 'An error occurred while verifying the token',
                    });
                }
        
                console.error("Token verification error:", error.message);
            } else {
                // If the error is not an instance of Error, handle it safely
                socket.emit('connection-response', {
                    type: 'error',
                    is_token_expire:true,
                    message: 'An unknown error occurred',
                });
                console.error("Unknown error:", error);
            }
            socket.disconnect()
            return
        }
       
        
        const ws = new WebSocket(socketurl);
        ws.on('open', () => {
            console.log('WebSocket connection opened to Coinbase.');
        });
        // setup subscription
        socket.on('subscribe', (message) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    method: message.type,
                    params: message?.channels,
                    id: 1 // id should be dyanmic
                }), (error) => {
                    if (error) {
                        socket.emit('connection-response', {
                            type:'error',
                            is_token_expire:false,
                            message: 'Subscription goes wrong',
                        });
                    }
                    if (!error) {
                        socket.emit('connection-response', {
                            type:'success',
                            is_token_expire:false,
                            message: 'Subscription successful',
                        });
                    }
                });
            } else {
                socket.emit('connection-response', {
                    type:'error',
                    is_token_expire:false,
                    message: 'WebSocket is not open yet. Queuing the subscription.',
                });
            }
        });

        // setup unsubscribe
        socket.on('unsubscribe', (message) => {

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    method: message.type,
                    params: message?.channels,
                    id: 1
                }), (error) => {
                    if (error) {
                        socket.emit('connection-response', {
                            type:'error',
                            is_token_expire:false,
                            message: 'UnSubscription goes wrong',
                        });
                    }
                    if (!error) {
                        socket.emit('connection-response', {
                            type:'success',
                            is_token_expire:false,
                            message: 'UnSubscription successful',
                        });
                    }
                });

            } else {
                socket.emit('connection-response', {
                    type:'error',
                    is_token_expire:false,
                    message: 'Product unSubscription goes wrong',
                });
            }
        });

        // setup ticker
        ws.onmessage = (event: any) => {
            const data = JSON.parse(event.data);
            if (data.data?.e === "trade") {
                socket.emit('ticker', data, (error: any) => {
                    console.log(error);
                });
            }
        };

        socket.on('disconnect', async () => {
            console.log("websocket disconnected..");
        })
    } else {
        // disconnect if token is expire
        socket.disconnect()
    }
});


app.use('/api', routes);
app.use('*', (req, res) => { res.status(statusCodes.OK).send({ st: 'true' }) });

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});