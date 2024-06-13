import { WebSocket } from 'ws';
import { wss } from '../index.js';
import Report from '../models/report.model.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js'
import { logServerError } from '../utils/logger.js';

const sendWSUpdate = () => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'report' }));
        }
    });
};

export const createReport = async (req, res, next) => {
    const body = req.body
    try {
        if (body.patientInfo.gender == '') body.patientInfo.gender = 'Other';
        const newReport = new Report(body);
        await newReport.save();

        sendWSUpdate();
        res.status(201).json({ message: 'Report created successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        console.error(error)
        logServerError(error.message);
        next(error);
    }
}

export const updateReport = async (req, res, next) => {
    const id = req.params.id
    const body = req.body

    try {
        await Report.findOneAndUpdate({ missionNumber: id }, body, { new: true });
        
        sendWSUpdate();
        res.status(200).json({ message: 'Report updated successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        console.error(error)
        logServerError(error.message);
        next(error);
    }
}

export const getReport = async (req, res, next) => {
    const id = req.params.id

    try {
        const report = await Report.findOne({ missionNumber: id });
        res.status(200).json(report);
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
}

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
}

export const deleteReport = async (req, res, next) => {
    const id = req.params.id;
    try {
        const report = await Report.findByIdAndDelete(id);
        
        sendWSUpdate();
        res.status(200).json({ message: 'Report deleted successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        logServerError(error.message);
        next(error);
    }
}