import express from 'express';
import {
  getExamsByUser,
  getClasses,
  removeExam,
  removeSubject,
  removeTeacher,
} from '../controllers/exam.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/classes', getClasses);

// PROTECTED ROUTES
router.post('/user/:IAM', verifyToken, getExamsByUser);
router.post('/remove/exam', verifyToken, removeExam);
router.post('/remove/subject', verifyToken, removeSubject);
router.post('/remove/teacher', verifyToken, removeTeacher);

export default router;