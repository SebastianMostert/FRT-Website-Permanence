// Import necessary modules
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import MemberIAM from '../models/memberIAM.model.js';
import ResetPassword from '../models/resetPasswordRequest.model.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { errorHandler } from '../utils/error.js';

// Sign Up
export const signup = async (req, res, next) => {
  try {
    req.body.IAM = req.body.IAM.toLowerCase(); // Convert IAM to lowercase
    req.body.password = bcryptjs.hashSync(req.body.password, 10);

    // Check if IAM is a member IAM
    const verified = await isMemberIAM(req.body.IAM);
    const newUser = new User({ ...req.body, verified });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  try {
    let { IAM, password, code } = req.body;
    IAM = IAM.toLowerCase(); // Convert IAM to lowercase

    const { success: validPassword, statusCode, statusText, user } = await validatePassword(IAM, password, code);

    if (!validPassword) {
      throw errorHandler(statusCode, statusText);
    }

    // Check if the user is verified
    if (!user.verified && ['admin', 'member', 'loge'].some(role => user.roles.includes(role))) {
      throw errorHandler(401, 'User is not verified');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, twoFactorAuthSecret, ...rest } = user._doc;
    const expiryDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    res.cookie('access_token', token, { httpOnly: true, expires: expiryDate }).status(200).json(rest);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Sign Out
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
};

// Validate
export const validate = (req, res, next) => {
  // Get the token
  const token = req.cookies.access_token;

  // Make sure token exists
  if (!token) return next(errorHandler(401, 'You are not authenticated!'));

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Token is not valid!'));

    // If it is valid inform the user it is valid with a 200 status
    res.status(200).json({ valid: true });
  });
};

/**
 * Check if IAM is a member IAM
 * @param {string} IAM The IAM of the user
 * @returns {boolean} Whether the user is a member
 */
async function isMemberIAM(IAM) {
  try {
    const memberIAM = await MemberIAM.findOne({ IAM: IAM.toLowerCase() });

    if (!memberIAM) {
      return false;
    }

    if (memberIAM.IAM === IAM.toLowerCase()) {
      return true;
    }

    return false;
  } catch (error) {
    throw errorHandler(500, 'Internal Server Error');
  }
}

// Add a forgot password and reset password function
/**
 * Forgot password function
 * @param {object} req The request object containing user's email
 * @param {object} res The response object
 * @param {object} next The next middleware function
 */
export const forgotPassword = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Get the user 
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user has a password
    if (user.twoFactorAuth) {
      const verified = validate2FaCode(user.twoFactorAuthSecret, otp);
      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'Invalid two-factor authentication code',
        });
      }
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Save the reset token to the database
    await ResetPassword.create({
      email,
      token: resetToken,
    });

    // Send the reset token to the user via email (You need to implement this)
    // Get the website url from the req object
    const websiteUrl = `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${websiteUrl}/reset-password/${resetToken}`;
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="padding: 20px;">
        <h2 style="color: #333333; font-weight: bold; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #666666;">You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
        <p style="color: #666666;">Please click on the following link to reset your password:</p>
        <a href="${resetUrl}" style="color: #ffffff; text-decoration: none; font-weight: bold;"><div style="background-color: #007bff; color: #ffffff; border-radius: 4px; text-align: center; padding: 10px; margin-bottom: 20px;">
          Reset Your Password
        </div></a>
        <p style="color: #666666;">If you did not request a password reset, please ignore this email. This link will expire in 10 minutes.</p>
      </div>
      <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-top: 1px solid #dddddd;">
        <p style="color: #888888; font-size: 12px; margin: 0;">This email was sent to ${email}</p>
      </div>
    </div>
  </div>
`;

    await sendEmail({
      to: email,
      subject: 'Password Reset Token',
      html
    });

    // Delete the reset token from the after 10 minutes
    setTimeout(async () => {
      await ResetPassword.deleteOne({ token: resetToken });
    }, 1000 * 60 * 10);

    res.status(200).json({
      success: true,
      message: 'Reset token sent to email',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reset token',
    });
  }
};

/**
 * Reset password function
 * @param {object} req The request object containing reset token and new password
 * @param {object} res The response object
 * @param {object} next The next middleware function
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword, totp } = req.body;

  try {
    // Find the reset token in the database
    const resetRecord = await ResetPassword.findOne({ token });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Token is valid, find the user by email
    const { email } = resetRecord;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the reset token record from the database
    await ResetPassword.deleteOne({ token });

    // Inform the user that password reset was successful via email
    const helpEmail = 'lux.frt.llis@gmail.com';
    const helpSubject = encodeURIComponent('Password Security Issue');
    const helpBody = encodeURIComponent(`Hello,\n\nI am reaching out because it seems that my password has been changed without my authorization.\nCould you please assist me in resolving this issue?\nMy IAM is: ${user.IAM}\n\nThank you,\n${user.lastName} ${user.firstName}`);

    const contactHelpLink = `mailto:${helpEmail}?subject=${helpSubject}&body=${helpBody}`;
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
            }
            p {
              margin: 20px 0;
              color: #555;
            }
            .btn {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Successful</h1>
            <p>Your password has been successfully reset.</p>
            <p>If you did not request this change, please contact us immediately.</p>
            <p>Thank you!</p>
            <a href="${contactHelpLink}" style="color: #ffffff; text-decoration: none; font-weight: bold;"><div style="background-color: #007bff; color: #ffffff; border-radius: 4px; text-align: center; padding: 10px; margin-bottom: 20px;">
              Email Support
            </div></a>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset',
      html,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  }
};

export const addTwoFactorAuthentication = async (req, res) => {
  try {
    // Get the user from the request, assuming you are sending user ID in the request
    const { iam } = req.body;

    // Generate a new secret for the user
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = await User.findOne({ IAM: iam });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if 2fa is enabled for the user
    if (user.twoFactorAuth) {
      return res.status(400).json({ error: 'Two-factor authentication is already enabled' });
    }

    // Save the secret key to the user document in the database
    await User.findOneAndUpdate({
      IAM: iam,
    }, {
      $set: {
        twoFactorAuthSecret: secret.base32,
      },
    });

    // Generate an OTP Auth URL
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: encodeURIComponent('First Responder Team - LLIS'),
      encoding: 'base32',
      issuer: 'First Responder Team - LLIS',
    });

    // Generate a QR Code for the user to scan
    qrcode.toDataURL(otpAuthUrl, (err, dataUrl) => {
      if (err) {
        return res.status(500).json({ error: 'Could not generate QR code' });
      }
      return res.json({ dataUrl });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const validateTwoFactorCode = async (req, res) => {
  try {
    const { iam, code } = req.body;

    // Find the user by ID
    const user = await User.findOne({ IAM: iam });

    // Check if user has a secret key for 2FA
    if (!user.twoFactorAuthSecret) {
      return res.status(400).json({ error: 'Two-factor authentication not set up' });
    }

    // Verify the entered code
    const verified = validate2FaCode(user.twoFactorAuthSecret, code);

    if (verified) {
      // Code is valid, you can now enable 2FA for the user
      await User.findOneAndUpdate({
        IAM: iam
      }, {
        $set: { twoFactorAuth: true }
      });

      return res.json({ message: 'Two-factor authentication enabled successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid two-factor authentication code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const removeTwoFactorAuthentication = async (req, res) => {
  try {
    const { iam, code, password } = req.body;

    if (!iam) return res.status(400).json({ error: 'Missing IAM' });
    if (!code) return res.status(400).json({ error: 'Missing code' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    // Validate password
    const { statusCode, statusText, success: validPassword } = await validatePassword(iam, password, code);
    if (!validPassword) return res.status(statusCode).json({ error: statusText });

    await User.findOneAndUpdate({
      IAM: iam
    }, {
      $set: {
        twoFactorAuth: false,
        twoFactorAuthSecret: undefined,
      },
    });

    return res.status(200).json({ message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

function validate2FaCode(secret, token) {
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1, // Allows for a time drift of 30 seconds in either direction
  });

  return verified;
}

async function validatePassword(IAM, password, code) {
  const user = await User.findOne({ IAM: IAM });
  if (!user) return { success: false, statusText: 'User not found', statusCode: 404, user };
  if (!user.password) return { success: false, statusText: 'Password not found', statusCode: 404, user };

  const passwordHash = user.password;
  if (!bcryptjs.compareSync(password, passwordHash)) return { success: false, statusText: 'Password is incorrect', statusCode: 401, user };

  // Validate 2FA
  if (!user.twoFactorAuth) return { success: true, user, statusCode: 200, statusText: 'Password is correct' };
  if (!user.twoFactorAuthSecret) return { success: false, statusText: 'Two-factor authentication not set up correctly', statusCode: 400, user };

  const verified = validate2FaCode(user.twoFactorAuthSecret, code);
  if (!verified) return { success: false, statusText: 'Two-factor authentication code is incorrect', statusCode: 401, user };

  return { success: true, user, statusCode: 200, statusText: 'Password is correct' };
}