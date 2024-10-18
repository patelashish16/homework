import express from 'express';
import { userSignUpValidator, userSignInValidator } from '../../utils/validations';
import { signIn, signUp } from '../../controllers/Auth';

const router = express.Router();

/**
   * @function signUp
   * @description Create new user
   * @param {Object} req
   * @returns
   */
router.post("/signup", userSignUpValidator, signUp);


/**
   * @function signIn
   * @description login user
   * @param {Object} req
   * @returns
   */
router.post("/signin", userSignInValidator, signIn);


export default router;

