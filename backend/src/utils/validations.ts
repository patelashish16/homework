import { NextFunction, Request, Response } from "express";
import { validationResult, body } from 'express-validator'
import { StatusCodes } from 'http-status-codes';

const validate = (validations: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.json({ st: false, statusCode: StatusCodes.BAD_REQUEST, errors: errors.array() });
    };
};

export const userSignUpValidator = validate([
    body('username', 'username does not Empty').not().isEmpty(),
    body('email', 'email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'password required min 1 lowercase,1 uppercase,1 number,1 symbol and 6 character length').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
]);

export const userSignInValidator = validate([
    body('email', 'email does not Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'password required min 1 lowercase,1 uppercase,1 number,1 symbol and 6 character length').isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
]);