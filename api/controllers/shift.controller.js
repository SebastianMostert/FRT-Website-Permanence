import Shift from '../models/shift.model.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js';

export const createShift = async (req, res, next) => {
  const { shifts } = req.body;

  try {
    // Validate if shifts is an array and has 2-3 objects
    if (!Array.isArray(shifts) || shifts.length < 2 || shifts.length > 3) {
      return res.status(400).json({ success: false, message: 'Shifts should be an array with 2-3 objects.' });
    }

    // Validate each shift object
    for (const shift of shifts) {
      if (
        !shift.IAM ||
        !shift.firstName ||
        !shift.lastName ||
        !shift.position ||
        !shift.availabilityId ||
        !shift.operationalPosition
      ) {
        return res.status(400).json({ success: false, message: 'Each shift object should have IAM, firstName, lastName, position, availabilityId, and operationalPosition.' });
      }
    }

    // Create the shifts
    const createdShifts = await Shift.create({ shifts: shifts });

    res.status(201).json({ success: true, data: createdShifts });
    sendReportsUpdated('shifts_updated')
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create shifts.', error: error.message });
  }
};

export const deleteShift = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the shift exists
    const shift = await Shift.findById(id);
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found.' });
    }

    // Delete the shift
    await Shift.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Shift deleted successfully.' });
    sendReportsUpdated('shifts_updated')
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete shift.', error: error.message });
  }
};

export const fetchAllShifts = async (req, res, next) => {
  try {
    const shifts = await Shift.find();

    res.status(200).json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch shifts.', error: error.message });
  }
};
