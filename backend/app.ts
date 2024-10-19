import express, { Express } from 'express';

import compression from 'compression';
import cors from 'cors'
import dotenv from 'dotenv';
import http from 'http';
import statusCodes from 'http-status-codes';
import routes from './src/routes/Auth'; // Import your API routes
import { setupSocket } from './src/socket/index'; // Import the separated WebSocket logic

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(compression({ level: 6, threshold: 0 }));
app.use(cors());


const server = http.createServer(app);


// Setup WebSocket handlers in a separate file
setupSocket(server);

// Setup API routes
app.use('/api', routes);
// Handle all other requests (catch-all route)
app.use('*', (req, res) => { res.status(statusCodes.OK).send({ st: 'true' }) });

// Start the server
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});