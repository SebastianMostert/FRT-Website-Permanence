import Report from '../models/report.model.js';

export const createReport = async (req, res, next) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(201).json({ message: 'Report created successfully' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getReport = async (req, res, next) => {
    const id = req.params.id
    try {
        const report = await Report.findById(id);
        res.status(200).json(report);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getAllReports = async (req, res, next) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const deleteReport = async (req, res, next) => {
    const id = req.params.id;
    try {
        const report = await Report.findByIdAndDelete(id);
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.log(error);
        next(error);
    }
}