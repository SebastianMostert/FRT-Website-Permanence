import Shift from '../models/shift.model.js';
import { sendReportsUpdated } from '../utils/invalidateCache.js';

export const createShift = async (req, res, next) => {
  const { startDate, endDate, title, users } = req.body;

  try {
    if (!startDate) return res.status(400).json({ success: false, message: 'Missing start date' });
    if (!endDate) return res.status(400).json({ success: false, message: 'Missing end date' });
    if (!title) return res.status(400).json({ success: false, message: 'Missing title' });
    if (!users) return res.status(400).json({ success: false, message: 'Missing users' });

    // Check if the users array has 2 to 3 objects
    if (users.length < 2 || users.length > 3) return res.status(400).json({ success: false, message: 'Each shift must have 2 to 3 users' });

    for (let i = 0; i < users.length; i++) {
      const {
        IAM,
        firstName,
        lastName,
        position
      } = users[i];

      if (!IAM || !firstName || !lastName || !position) return res.status(400).json({ success: false, message: 'Each user must have an IAM, first name, last name, and a position' });
    }

    // Create the shifts
    const createdShifts = await Shift.create({
      startDate,
      endDate,
      title,
      users,
    });

    res.status(201).json({ success: true, data: createdShifts });
    sendReportsUpdated('shifts_updated')
  } catch (error) {
    console.error(error)
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
