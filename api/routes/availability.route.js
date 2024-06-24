import express from 'express';
import { createAvailability, getAvailabilities, deleteAvailability, getAllAvailabilities, getAvailabilityByID, updateAvailability } from '../controllers/availability.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// PROTECTED ROUTES
router.post('/create', verifyToken, createAvailability);
router.post('/get', verifyToken, getAllAvailabilities);
router.post('/get/IAM/:IAM', verifyToken, getAvailabilities);
router.post('/get/ID/:id', verifyToken, getAvailabilityByID);
router.post('/update/:id', verifyToken, updateAvailability);

router.delete('/delete/:id', verifyToken, deleteAvailability);

export default router;
