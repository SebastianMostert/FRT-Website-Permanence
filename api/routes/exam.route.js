import express from 'express';
import {
  getExamsByUser,
  getClasses
} from '../controllers/exam.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/user/:IAM', verifyToken, getExamsByUser);
router.post('/classes', getClasses);

export default router;