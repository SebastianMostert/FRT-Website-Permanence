import express from 'express';
import {
    fetchAllAudits
} from '../controllers/audit.controller.js';

const router = express.Router();

router.post('/fetch', fetchAllAudits);

export default router;
