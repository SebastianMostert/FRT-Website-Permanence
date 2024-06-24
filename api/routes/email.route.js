import express from 'express';
import {
    sendEmailEmailVerification,
    sendEmailPasswordReset,
    sendEmailIPVerification,
    sendEmailShiftNotification,
    sendAnyEmail,
} from '../controllers/email.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

// sendSecurityEmail2faAdded,
// sendSecurityEmail2faRemoved,
// sendSecurityEmailIpAdded

const router = express.Router();

// All routes are used to send emails
/**
 * Following emails need to be sent:
 *  1. Email verification (needs code, time, email)                             | Protected: false
 *  2. Password reset (needs email, otp)                                        | Protected: false
 *  3. Security email, password reset (this will be done on the server side)    | Protected: true
 *  4. Shift notification                                                       | Protected: true
 *  5. Free (allowed to send any email)                                         | Protected: true
 */

// Unprotected Routes
router.post('/verify/email', sendEmailEmailVerification);
router.post('/verify/ip', sendEmailIPVerification);

router.post('/reset-password', sendEmailPasswordReset);

// Protected Routes
router.post('/send', verifyToken, sendAnyEmail);
router.post('/shift', verifyToken, sendEmailShiftNotification);

// Security Notifications
// router.post('/security/password-reset', verifyToken,); -> This is already done
// More security notifications to be added:
// 1. Password changed
// 2. 2FA added
// 3. 2FA removed
// 4. New IP login added

export default router;