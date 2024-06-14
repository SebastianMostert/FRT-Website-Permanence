import express from 'express';
import {
    createTeam,
    deleteUser,
    fetchTeam,
    fetchTeams,
    updateTeamMembers,
    updateTeamStatus,
    updateAlert
} from '../controllers/team.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// PROTECTED ROUTES
router.post('/create', verifyToken, createTeam);
router.post('/fetch', verifyToken, fetchTeams);
router.post('/fetch/:id', verifyToken, fetchTeam);
router.post('/update-members/:id', verifyToken, updateTeamMembers);
router.post('/update-status/:id', verifyToken, updateTeamStatus);
router.post('/update-alert/:id', verifyToken, updateAlert);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
