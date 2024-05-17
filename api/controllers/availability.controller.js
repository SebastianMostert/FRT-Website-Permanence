import User from '../models/user.model.js';
import Availability from '../models/availability.model.js';
import { errorHandler } from '../utils/error.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js';
import { logServerError, logHTTPRequest } from '../utils/logger.js';

/** 
 * LOGGER INFO
 * All HTTP requests are logged to the logger.
*/

// Create availability
export const createAvailability = async (req, res, next) => {
    logHTTPRequest('/availability/create', req.ip);
    try {
        const { IAM, startTime, endTime } = req.body;
        const validIAM = IAM.toLowerCase();

        const newAvailability = new Availability({ IAM: validIAM, startTime, endTime });
        await newAvailability.save();

        res.status(201).json(newAvailability);
        sendReportsUpdated('availabilities_updated');
    } catch (error) {
        logServerError(error.message);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Get availability by IAM
export const getAvailabilities = async (req, res, next) => {
    const { IAM } = req.body;
    logHTTPRequest(`/availability/get/IAM/${IAM}`, req.ip);
    try {
        const validIAM = IAM.toLowerCase();
        const availabilities = await Availability.find({ IAM: validIAM });

        res.status(200).json(availabilities);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

export const getAvailabilityByID = async (req, res, next) => {
    const { id } = req.params;
    logHTTPRequest(`/availability/get/ID/${id}`, req.ip);
    try {
        const availability = await Availability.findById(id);
        res.status(200).json(availability);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
}

// Get all availabilities
export const getAllAvailabilities = async (req, res, next) => {
    logHTTPRequest('/availability/get', req.ip);
    try {
        const availabilities = await Availability.find();

        // Find the profile associated with the availability
        const names = [];
        const availabilitiesWithName = [];

        for (let i = 0; i < availabilities.length; i++) {
            const availability = availabilities[i];
            const profile = await User.findOne({ IAM: availability.IAM?.toLocaleLowerCase() });
            if (!profile) continue
            if (!profile.firstName) continue
            if (!profile.lastName) continue
            const name = `${profile.firstName[0].toUpperCase()}. ${profile.lastName}`;
            availabilitiesWithName.push({ ...availability.toObject(), name });
        }

        res.status(200).json(availabilitiesWithName);
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Delete availability
export const deleteAvailability = async (req, res, next) => {
    const { IAM, id } = req.body;
    logHTTPRequest(`/availability/delete/${id}`, req.ip);
    try {
        const validIAM = IAM.toLowerCase();

        const deleted = await Availability.deleteOne({
            IAM: validIAM,
            _id: id
        });

        if (deleted.deletedCount > 0) {
            return res.status(200).json(deleted);
            sendReportsUpdated('availabilities_updated');
        }
        res.status(404).json({ message: 'Availability not found', success: false });
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
};

// Update
export const updateAvailability = async (req, res, next) => {
    const { id } = req.params;
    logHTTPRequest(`/availability/update/${id}`, req.ip);
    try {
        const { startTime, endTime } = req.body;

        const updated = await Availability.findByIdAndUpdate(id, {
            startTime,
            endTime
        });

        if (updated) {
            return res.status(200).json(updated);
            sendReportsUpdated('availabilities_updated');
        }
        res.status(404).json({ message: 'Availability not found', success: false });
    } catch (error) {
        logServerError(error);
        next(errorHandler(500, 'Internal Server Error'));
    }
}
