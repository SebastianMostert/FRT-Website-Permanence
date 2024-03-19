import express from 'express';
import { createAvailability, getAvailabilities, deleteAvailability, getAllAvailabilities, getAvailabilityByID } from '../controllers/availability.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createAvailability);
router.post('/get/:IAM', verifyToken, getAvailabilities);
router.post('/all', verifyToken, getAllAvailabilities);
router.post('/get-by-id/:id', verifyToken, getAvailabilityByID);
router.delete('/delete', verifyToken, deleteAvailability);

export default router;
