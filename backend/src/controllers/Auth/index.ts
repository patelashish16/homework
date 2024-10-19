import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../prisma/prisma-client'; // Adjust path to your Prisma client
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Sign up a new user
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with success or error message
 */
export async function signUp(req: Request, res: Response): Promise<Response> {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                statusCode: StatusCodes.CONFLICT,
                msg: 'Email is already registered.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // Check if the user creation was successful
        if (!newUser) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                msg: 'Failed to create user. Please try again.',
            });
        }

        return res.status(StatusCodes.CREATED).json({
            success: true,
            statusCode: StatusCodes.CREATED,
            data: newUser,
            msg: 'User created successfully.',
        });
    } catch (error: any) {
        console.error('Sign-up error:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: 'Internal server error',
        });
    }
}

/**
 * Sign in an existing user
 * @param req Express request object
 * @param res Express response object
 * @returns JSON response with JWT token and user data
 */
export async function signIn(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                msg: 'Invalid email or password.',
            });
        }

        // Compare the provided password with the stored hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                statusCode: StatusCodes.UNAUTHORIZED,
                msg: 'Invalid email or password.',
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined in the environment variables.');
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                msg: 'Internal server error: JWT_SECRET is not defined.',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            jwtSecret,
            { expiresIn: '24h' } // Token valid for 24 hours
        );

        // Respond with the JWT token and user data
        const data = {
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        };

        return res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            data,
            msg: 'User logged in successfully.',
        });
    } catch (error: any) {
        console.error('Sign-in error:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            msg: 'Internal server error',
        });
    }
}
