import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import prisma from '../../../prisma/prisma-client';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// Create a new user

export async function signUp(req: Request, res: Response) {
    try {
        const { username, email, password, } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        if (!newUser) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Something went wrong' });
        }

        return res.json({ st: true, statusCode: StatusCodes.OK, data: newUser, msg: 'User created successfully' });

    } catch (e: any) {
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};
// for login api
export async function signIn(req: Request, res: Response) {
    try {
        const { email, password, } = req.body;
        // 1. Check if the user exists by email
        const user = await prisma.users.findUnique({
            where: { email },
        });


        if (!user) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid email or password.' });
        }

        // 2. Compare the password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: 'Invalid email or password.' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        // Check if jwtSecret is undefined
        if (!jwtSecret) {
            // Handle the case where JWT_SECRET is not defined
            return res.json({ st: true, statusCode: StatusCodes.BAD_REQUEST, msg: 'WT_SECRET is not defined' });
        }
        console.log("jwtSecret",jwtSecret)
        // 3. Generate a JWT token (optional, but commonly done in login flows)
        const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
            expiresIn: '24h', // Token expires in 1 hour
        });

        // 4. Respond with the token and success message
        const data = {
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        }
        return res.json({ st: true, statusCode: StatusCodes.OK, data: data, msg: 'User login successfully' });

    } catch (e: any) {
        console.error(e);
        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, msg: e.message });
    }
};