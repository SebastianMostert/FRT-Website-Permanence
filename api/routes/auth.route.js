import express from 'express';
import {
    signin,
    signup,
    signout,
    validate,
    forgotPassword,
    resetPassword,
    addTwoFactorAuthentication,
    removeTwoFactorAuthentication,
    validateTwoFactorCode
} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/validate', validate);
router.post('/signout', signout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// PROTECTED ROUTES
router.post('/2fa/add', verifyToken, addTwoFactorAuthentication);
router.post('/2fa/validate', verifyToken, validateTwoFactorCode);
router.post('/2fa/remove', verifyToken, removeTwoFactorAuthentication);

export default router;
