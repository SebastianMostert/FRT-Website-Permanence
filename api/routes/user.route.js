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

router.post('/fetch/2fa/email/:email', fetchUserAuthEnabledByEmail);
router.post('/fetch/2fa/IAM/:IAM', fetchUserAuthEnabledByIAM);
router.post('/verify-email', verifyEmail);
router.post('/exists/:IAM', exists);

// PROTECTED ROUTES
router.post('/fetch-all', verifyToken, fetchAllUsers);
router.post('/fetch', verifyToken, fetchAllUsers);
router.post('/fetch/:IAM', verifyToken, fetchUser);
router.post('/roles/:IAM', verifyToken, fetchRoles);
router.post('/update/:id', verifyToken, updateUser);
router.post('/update/', verifyToken, updateUser);
router.post('/notify', verifyToken, notifyUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
