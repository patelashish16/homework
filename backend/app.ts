import express, { Express, NextFunction, Request, Response } from 'express';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import statusCodes from 'http-status-codes';
import routes from './src/routes/Auth'; // Import API routes
import { setupSocket } from './src/socket/index'; // Import the separated WebSocket logic
import prisma from './prisma/prisma-client'; // import Prisma client

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(compression({ level: 6, threshold: 0 }));
app.use(cors());



// Health check endpoint
app.get('/health', (req, res) => {
    res.status(statusCodes.OK).json({ status: 'UP' });
});

async function startServer() {
    try {
        // Attempt to connect to the Prisma database
        await prisma.$connect();
        console.log('Connected to the database successfully.');

        const server = http.createServer(app);
        // Setup WebSocket handlers in a separate file
        setupSocket(server);

        // Setup API routes
        app.use('/api', routes);

        // Centralized error-handling middleware
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack); // Log the error stack trace
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Something went wrong! Please try again later.',
            });
        });

        // Handle all other requests (catch-all route)
        app.use('*', (req, res) => {
            res.status(statusCodes.OK).send({
                success: false
            });
        });

        // Start the server
        server.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });

        // Graceful shutdown
        const shutdown = async () => {
            console.log('Received shutdown signal. Closing server...');
            await prisma.$disconnect(); // Disconnect Prisma client
            server.close(() => {
                console.log('Server closed gracefully.');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);

    } catch (error: any) {
        console.error('An unexpected error occurred:', error.message);
        process.exit(1); // Exit for any other unexpected errors
    }
}

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Start server
startServer();