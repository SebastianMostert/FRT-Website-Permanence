import Availability from '../models/availability.model.js';
import { errorHandler } from '../utils/error.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js';

// Create availability
export const createAvailability = async (req, res, next) => {
    try {
        const { IAM, startTime, endTime } = req.body;
        const validIAM = IAM.toLowerCase();

        const newAvailability = new Availability({ IAM: validIAM, startTime, endTime });
        await newAvailability.save();

        res.status(201).json({ message: 'Availability created successfully', success: true, availability: newAvailability });
        sendReportsUpdated('availabilities_updated');
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Get availability by IAM
export const getAvailabilities = async (req, res, next) => {
    try {
        const validIAM = req.params.IAM.toLowerCase();
        const availabilities = await Availability.find({ IAM: validIAM });

        res.status(200).json(availabilities);
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getAvailabilityByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const availability = await Availability.findById(id);
        res.status(200).json(availability);
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
}

// Get all availabilities
export const getAllAvailabilities = async (req, res, next) => {
    try {
        const availabilities = await Availability.find();
        res.status(200).json(availabilities);
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Delete availability
export const deleteAvailability = async (req, res, next) => {
    try {
        const { IAM, id } = req.body;
        const validIAM = IAM.toLowerCase();

        const deleted = await Availability.deleteOne({
            IAM: validIAM,
            _id: id
        });

        if (deleted.deletedCount > 0) {
            return res.status(200).json({ message: 'Availability deleted successfully', success: true });
            sendReportsUpdated('availabilities_updated');
        }
        res.status(404).json({ message: 'Availability not found', success: false });
    } catch (error) {
        console.log(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};
