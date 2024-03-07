import express from 'express';
import {
  getExamsByUser
} from '../controllers/exam.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/user/:IAM', verifyToken, getExamsByUser);

export default router;