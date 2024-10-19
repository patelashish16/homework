import { NextFunction, Request, Response } from "express";
import { validationResult, body, ValidationChain } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware to handle validation results for requests.
 * @param validations Array of validation chains to run
 * @returns Express middleware function that runs the validations and handles errors.
 */
const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run each validation
        for (let validation of validations) {
            await validation.run(req); // Removed direct access to 'errors'
        }

        // Gather all validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next(); // Proceed to the next middleware if no errors
        }

        // Return validation errors as response
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            errors: errors.array(),
        });
    };
};

/**
 * Validator for user sign-up.
 * Validates:
 *  - Username is not empty
 *  - Email is not empty and is valid
 *  - Password meets the required strength criteria
 */
export const userSignUpValidator = validate([
    body('username')
        .notEmpty().withMessage('Username must not be empty'),

    body('email')
        .notEmpty().withMessage('Email must not be empty')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }).withMessage('Password must include at least 1 lowercase, 1 uppercase, 1 number, 1 symbol, and be at least 6 characters long'),
]);

/**
 * Validator for user sign-in.
 * Validates:
 *  - Email is not empty and is valid
 *  - Password meets the required strength criteria
 */
export const userSignInValidator = validate([
    body('email')
        .notEmpty().withMessage('Email must not be empty')
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }).withMessage('Password must include at least 1 lowercase, 1 uppercase, 1 number, 1 symbol, and be at least 6 characters long'),
]);
