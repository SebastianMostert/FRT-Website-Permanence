import express from 'express';
import {
    createShift,
    deleteShift,
    fetchAllShifts
} from '../controllers/shift.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createShift);
router.post('/fetch', verifyToken, fetchAllShifts);
router.delete('/delete', verifyToken, deleteShift);

export default router;
