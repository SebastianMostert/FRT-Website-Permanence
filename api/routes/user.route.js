import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  fetchUser,
  notifyUser,
  fetchUserAuthEnabled,
  verifyEmail
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/fetch/:IAM', verifyToken, fetchUser);
router.post('/update/:id', verifyToken, updateUser);
router.post('/notify', verifyToken, notifyUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.post('/fetch/2fa/:IAM', fetchUserAuthEnabled);

router.post('/verify-email', verifyEmail);

export default router;
