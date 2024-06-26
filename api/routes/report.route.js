import express from 'express';
import {
    createReport,
    deleteReport,
    getAllReports,
    getReport,
    updateReport
} from '../controllers/report.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// PROTECTED ROUTES
router.post('/create', verifyToken, createReport);
router.post('/update/:id', verifyToken, updateReport);
router.post('/fetch/:id', verifyToken, getReport);
router.post('/fetch-all', verifyToken, getAllReports);
router.post('/fetch', verifyToken, getAllReports);
router.delete('/delete/:id', verifyToken, deleteReport);

export default router;