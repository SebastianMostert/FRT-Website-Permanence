import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendEmail from '../utils/sendEmail.js';
import { wss } from '../index.js';
import { WebSocket } from 'ws';

const sendWSUpdate = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'user' }));
      client.send(JSON.stringify({ type: 'team' }));
    }
  });
};

// Test
export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Update User
export const updateUser = async (req, res, next) => {
  const body = req.body;
  try {
    // Fetch the user
    const user = await User.findById(req.body.id);
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

    const emailVerified = (body?.emailVerified !== undefined) ? body.emailVerified : user.emailVerified;
    const notifications = (body?.notifications !== undefined) ? body.notifications : user.notifications;
    const onBoarded = (body?.onBoarded !== undefined) ? body.onBoarded : user.onBoarded;

    const hasKey = (body?.hasKey !== undefined) ? body.hasKey : user.hasKey;
    const hasPhone = (body?.hasPhone !== undefined) ? body.hasPhone : user.hasPhone;

    const roles = (body?.roles !== undefined) ? body.roles : user.roles;

    const updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        $set: {
          firstName,
          lastName,
          studentClass,
          password: body.password,
          experience,
          email,
          training,
          operationalPosition: checkOperationalPosition(
            training,
            experience.RTW,
            experience.FR
          ),
          administratifPosition,
          IAM,
          llisPosition,
          verified,
          emailVerified,
          notifications,
          onBoarded,
          roles,
          hasKey,
          hasPhone
        },
      },
      { new: true }
    );

    sendWSUpdate();
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while updating user.'));
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  // TODO: FIX
  // Check if the user is an admin 
  // if (user.id !== req.params.id) {
  //   return next(errorHandler(401, 'You can update only your account!'));
  // }
  try {
    await User.findByIdAndDelete(req.params.id);
    sendWSUpdate();
    res.status(200).json('User has been deleted...');
  } catch (error) {
    console.error(error);
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
    // Before sending the data to the user remove the password and twoFactorAuthSecret
    const { password, twoFactorAuthSecret, ...rest } = user[0];
    res.status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

// Fetch All User
export const fetchAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    let usersArray = [];
    // Before sending the data to the user remove the password and twoFactorAuthSecret from each user
    usersArray = users.map(user => {
      const { password, twoFactorAuthSecret, ...rest } = user._doc;
      return rest;
    })

    res.status(200).json(usersArray);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

// Fetch authenticator enabled
export const fetchUserAuthEnabledByIAM = async (req, res, next) => {
  const IAM = req.params.IAM;
  try {
    const user = await User.find({ IAM });
    if (!user || user.length === 0) {
      return next(errorHandler(404, 'User not found.'));
    }
    // Before sending the data to the user remove the password and twoFactorAuthSecret
    const { twoFactorAuth } = user[0];
    res.status(200).json(twoFactorAuth);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

export const fetchUserAuthEnabledByEmail = async (req, res, next) => {
  const email = req.params.email;
  try {
    const user = await User.find({ email });
    if (!user || user.length === 0) {
      return next(errorHandler(404, 'User not found.'));
    }
    // Before sending the data to the user remove the password and twoFactorAuthSecret
    const { twoFactorAuth } = user[0];
    res.status(200).json(twoFactorAuth);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

export const notifyUser = async (req, res, next) => {
  const emailBody = req.body.emailBody;

  const info = sendEmail(emailBody);

  return res.status(200).json({ info });
};

export const verifyEmail = async (req, res, next) => {
  const { code, time, email } = req.body;

  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .header {
          background-color: #007bff;
          color: #fff;
          padding: 20px;
          text-align: center;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }
        .content {
          padding: 20px;
        }
        .button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
        }
        .form-card {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Please verify your email address by entering the following code in the verification form:</p>
          <h2 style="text-align: center;">${code}</h2>
          <p>The code will expire in ${time / 60} minutes.</p>
          <p>Thank you!</p>
        </div>
      </div>
    </body>
  </html>
`;

  const info = sendEmail({
    to: email,
    subject: 'Email verification',
    html,
  });

  return res.status(200).json({ info });
};
const checkOperationalPosition = (training, rtwExperience, frExperience) => {
  const hasFirstAidCourse = training.includes('First Aid Course');
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

export const fetchRoles = async (req, res, next) => {
  const IAM = req.params.IAM;
  try {
    const user = await User.find({ IAM });
    if (!user || user.length === 0) {
      return next(errorHandler(404, 'User not found.'));
    }
    // Before sending the data to the user remove the password and twoFactorAuthSecret
    const { roles } = user[0];
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};

export const exists = async (req, res, next) => {
  const IAM = req.params.IAM;
  try {
    const user = await User.find({ IAM });

    if (user?.length > 0) {
      res.status(200).json({ exists: true }); // Send response indicating user exists
    } else {
      res.status(200).json({ exists: false }); // Send response indicating user doesn't exist
    }
  } catch (error) {
    console.error(error);
    next(errorHandler(500, 'An error occurred while fetching user.'));
  }
};
