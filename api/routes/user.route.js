import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  fetchUser,
  notifyUser,
  verifyEmail,
  fetchUserAuthEnabledByEmail,
  fetchUserAuthEnabledByIAM,
  fetchAllUsers,
  fetchRoles,
  exists
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.post('/fetch-all', verifyToken, fetchAllUsers);
router.post('/fetch/:IAM', verifyToken, fetchUser);
router.post('/roles/:IAM', verifyToken, fetchRoles);
router.post('/update/:id', verifyToken, updateUser);
router.post('/notify', verifyToken, notifyUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.post('/fetch/2fa/IAM/:IAM', fetchUserAuthEnabledByIAM);
router.post('/fetch/2fa/email/:email', fetchUserAuthEnabledByEmail);
router.post('/exists/:IAM', exists);

router.post('/verify-email', verifyEmail);

export default router;
