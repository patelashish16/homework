import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from 'http-status-codes';

// Zod schemas for validation
const userSignUpSchema = z.object({
  username: z.string().min(1, { message: 'Username must not be empty' }),
  email: z.string()
    .min(1, { message: 'Email must not be empty' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message: 'Password must include at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.',
    }),
});

const userSignInSchema = z.object({
  email: z.string()
    .min(1, { message: 'Email must not be empty' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message: 'Password must include at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol.',
    }),
});

// Middleware to validate incoming requests
const validate = (schema: z.ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the Zod schema
      schema.parse(req.body);
      return next(); // If validation passes, proceed to the next middleware
    } catch (error) {
      if (error instanceof ZodError) {
        // If validation fails, return a 400 response with error details
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          errors: error.errors, // Zod error details
        });
      }
      // Handle unexpected errors
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

// Export validators as middleware
export const userSignUpValidator = validate(userSignUpSchema);
export const userSignInValidator = validate(userSignInSchema);
