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
  const body = req.body;
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    if (body.password) {
      body.password = bcryptjs.hashSync(body.password, 10);
    }

    if (body.experience) {
      body.experience.RTW = body.experienceRTW || body.experience.RTW;
      body.experience.FR = body.experienceFR || body.experience.FR;
    }

    const training = [];
    if (body.training) {
      for (let i = 0; i < body.training.length; i++) {
        const _training = body.training[i];
        console.log(_training)

        training.push(_training.value);
        console.log(training)
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: body.firstName,
          lastName: body.lastName,

          studentClass: body.studentClass,
          password: body.password,
          profilePicture: body.profilePicture,
          experience: body.experience,
          email: body.email,
          training,
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