import express from 'express';
import {
    deleteSession,
    fetchSessions
} from '../controllers/session.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// PROTECTED ROUTES
router.post('/fetch/:userID', verifyToken, fetchSessions);
router.delete('/delete/:id', verifyToken, deleteSession);

export default router;
