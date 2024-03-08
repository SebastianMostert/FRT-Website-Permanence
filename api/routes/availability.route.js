import express from 'express';
import { createAvailability, getAvailabilities, deleteAvailability } from '../controllers/availability.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
// TODO: Implement verify token

const router = express.Router();

router.post('/create', verifyToken, createAvailability);
router.post('/get/:IAM', verifyToken, getAvailabilities);
router.delete('/delete/:id', verifyToken, deleteAvailability);

export default router;
