import express from 'express';
import {
    createReport,
    deleteReport,
    getAllReports,
    getReport
} from '../controllers/report.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createReport);
router.post('/fetch/:id', verifyToken, getReport);
router.post('/fetch/all', verifyToken, getAllReports);
router.delete('/delete/:id', verifyToken, deleteReport);

export default router;