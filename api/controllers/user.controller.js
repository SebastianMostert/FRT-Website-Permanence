import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

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
    if (body.trainingSAP1) training.push('SAP 1');
    if (body.trainingSAP2) training.push('SAP 2');

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
    next(errorHandler(500, 'An error occurred while updating user.'));
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
    console.log(error);
    next(errorHandler(500, 'An error occurred while deleting user.'));
  }
};

// Fetch User
export const fetchUser = async (req, res, next) => {
  const IAM = req.params.IAM;
  try {
    const user = await User.find({ IAM });
    if (!user || user.length === 0) {
      return next(errorHandler(404, 'User not found.'));
    }
    const { password, ...rest } = user[0];
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

export const notifyUser = async (req, res, next) => {
  const emailBody = req.body.emailBody;

  const emailUser = process.env.REACT_APP_EMAIL_USER;
  const emailPassword = process.env.REACT_APP_EMAIL_PASSWORD;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });

  // Send email using transporter
  let info = await transporter.sendMail(emailBody);


  return res.status(200).json({ info });
};
