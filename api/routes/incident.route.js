import express from 'express';
import {
    createIncident
} from '../controllers/incident.controller.js';

const router = express.Router();

router.post('/create', createIncident);

export default router;
