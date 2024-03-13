import Availability from '../models/availability.model.js';

// Create availability
export const createAvailability = async (req, res, next) => {
    try {
        const { IAM, startTime, endTime } = req.body;
        const validIAM = IAM.toLocaleLowerCase();


        const newAvailability = new Availability({ IAM: validIAM, startTime, endTime });
        try {
            await newAvailability.save();
            res.status(201).json({ message: 'Availability created successfully', success: true, availability: newAvailability });
        } catch (error) {
            console.log(error);
            next(error);
        }
    } catch (err) {
        next(err);
    }
};

// Get availability
export const getAvailabilities = async (req, res, next) => {
    const validIAM = req.params.IAM.toLocaleLowerCase();

    const availabilities = await Availability.find({ IAM: validIAM });

    res.status(200).json(availabilities);

};

export const getAllAvailabilities = async (req, res, next) => {
    const availabilities = await Availability.find();

    res.status(200).json(availabilities);
};

// Delete availability
export const deleteAvailability = async (req, res, next) => {
    const validIAM = req.body.IAM.toLocaleLowerCase();
    const id = req.params.id;

    try {
        const deleted = await Availability.deleteMany({
            IAM: validIAM,
            _id: id
        });

        if (deleted.deletedCount > 0) {
            return res.status(200).json({ message: 'Availability deleted successfully', success: true });
        }
        res.status(200).json({ message: 'An issue occurred', success: false });
    } catch (err) {
        next(err);
    }
};