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

const router = express.Router();

router.post('/create', createTeam);
router.post('/fetch', fetchTeams);
router.post('/fetch/:id', fetchTeam);
router.post('/update-members/:id', updateTeamMembers);
router.post('/update-status/:id', updateTeamStatus);
router.post('/update-alert/:id', updateAlert);
router.delete('/delete/:id', deleteUser);

export default router;
