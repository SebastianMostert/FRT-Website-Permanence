import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  fetchUser,
  notifyUser
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/fetch/:IAM', verifyToken, fetchUser);
router.post('/update/:id', verifyToken, updateUser);
router.post('/notify', verifyToken, notifyUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
