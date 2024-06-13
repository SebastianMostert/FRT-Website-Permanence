import express from 'express';
import {
    fetchUserCount,
    fetchCasesCount
} from '../controllers/stats.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/count/users', fetchUserCount);
router.post('/count/cases', fetchCasesCount);

// PROTECTED ROUTES
// router.post('/private', verifyToken, fetchAllUsers);


export default router;