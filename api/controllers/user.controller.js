import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

// Test
export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Update User
export const updateUser = async (req, res, next) => {
  console.log(req.body);
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.training) {
      // Convert the string of trainings seperated by comma to an array
      console.log(req.body.training);
      try {
        req.body.training = req.body.training?.split(',');
      } catch (error) {
        req.body.training = [];
      }
    }

    if (req.body.experience) {
      req.body.experience.RTW = req.body.experienceRTW || req.body.experience.RTW;
      req.body.experience.FR = req.body.experienceFR || req.body.experience.FR;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,

          studentClass: req.body.studentClass,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          experience: req.body.experience,
          email: req.body.email,
          training: req.body.training,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    next(error);
  }

}