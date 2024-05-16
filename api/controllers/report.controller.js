import Report from '../models/report.model.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js'
import { logServerError } from '../utils/logger.js';

export const createReport = async (req, res, next) => {
    const body = req.body
    try {
        const newReport = new Report(body);
        await newReport.save();
        res.status(201).json({ message: 'Report created successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        logServerError(error);
        next(error);
    }
}

export const updateReport = async (req, res, next) => {
    const id = req.params.id
    const body = req.body

    try {
        await Report.findOneAndUpdate({ missionNumber: id }, body, { new: true });
        res.status(200).json({ message: 'Report updated successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        logServerError(error);
        next(error);
    }
}

export const getReport = async (req, res, next) => {
    const id = req.params.id

    try {
        const report = await Report.findOne({ missionNumber: id });
        res.status(200).json(report);
    } catch (error) {
        logServerError(error);
        next(error);
    }
}

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        logServerError(error);
        next(error);
    }
}

export const deleteReport = async (req, res, next) => {
    const id = req.params.id;
    try {
        const report = await Report.findByIdAndDelete(id);
        res.status(200).json({ message: 'Report deleted successfully' });
        sendReportsUpdated('reports_updated');
    } catch (error) {
        logServerError(error);
        next(error);
    }
}