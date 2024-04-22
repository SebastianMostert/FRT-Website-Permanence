import express from 'express';
import {
    createIncident,
    fetchAllIncidents,
    fetchIncident
} from '../controllers/incident.controller.js';

const router = express.Router();

router.post('/create', createIncident);
router.post('/fetch/:id', fetchIncident);
router.post('/fetch', fetchAllIncidents);

export default router;
