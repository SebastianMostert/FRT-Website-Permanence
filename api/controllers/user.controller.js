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
    // Fetch the user
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found.'));
    }

    if (body.password) {
      body.password = bcryptjs.hashSync(body.password, 10);
    }

    if (body.experience) {
      body.experience.RTW = body.experienceRTW || body.experience.RTW;
      body.experience.FR = body.experienceFR || body.experience.FR;
    }

    const firstAidCourse = (body?.firstAidCourse !== undefined) ? body.firstAidCourse : user.firstAidCourse;
    const firstName = (body?.firstName !== undefined) ? body.firstName : user.firstName;
    const lastName = (body?.lastName !== undefined) ? body.lastName : user.lastName;
    const studentClass = (body?.studentClass !== undefined) ? body.studentClass : user.studentClass;
    const experience = (body?.experience !== undefined) ? body.experience : user.experience;
    const email = (body?.email !== undefined) ? body.email : user.email;
    const training = (body?.training !== undefined) ? body.training : user.training;
    const administratifPosition = (body && body.administratifPosition !== undefined) ? body.administratifPosition : user.administratifPosition;
    const IAM = (body?.IAM !== undefined) ? body.IAM : user.IAM;
    const llisPosition = (body?.llisPosition !== undefined) ? body.llisPosition : user.llisPosition;
    const verified = (body?.verified !== undefined) ? body.verified : user.verified;


    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstAidCourse,
          firstName,
          lastName,
          studentClass,
          password: body.password,
          experience,
          email,
          training,
          operationalPosition: checkOperationalPosition(
            firstAidCourse,
            training,
            experience.RTW,
            experience.FR
          ),
          administratifPosition,
          IAM,
          llisPosition,
          verified,
        },
      },
      { new: true }
    );

    // Save the updated user
    await updatedUser.save();

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

  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;

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

const checkOperationalPosition = (firstAidCourse, training, rtwExperience, frExperience) => {
  const hasFirstAidCourse = firstAidCourse;
  const hasSAP1 = training.includes('SAP 1');
  const hasSAP2 = training.includes('SAP 2');
  const hasRTWExperience = rtwExperience >= 100;
  const hasFRExperience = frExperience >= 300;

  if (!hasFirstAidCourse) return 'None';
  else if (hasSAP2) return 'Chef Agres';
  else if (hasSAP1 && (hasRTWExperience || hasFRExperience)) return 'Chef Agres';
  else if (hasSAP1) return 'Equipier Bin.';
  else if (hasFirstAidCourse) return 'Stagiaire Bin.';
  else return 'None';
};