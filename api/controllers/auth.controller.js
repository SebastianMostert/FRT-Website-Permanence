// Import necessary modules
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import MemberIAM from '../models/memberIAM.model.js';
import Session from '../models/session.model.js';
import ResetPassword from '../models/resetPasswordRequest.model.js';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { errorHandler } from '../utils/error.js';
import { logServerError, logHTTPRequest, logUserAction, logUserError } from '../utils/logger.js';
import { UAParser } from 'ua-parser-js';
import { sendSecurityEmailPasswordReset } from './email.controller.js';

/** 
 * LOGGER INFO
 * All HTTP requests are logged to the logger.
 * All server errors are logged to the logger.
 * All user actions are logged to the logger.
 * All user errors are logged to the logger.
*/

// Sign Up
export const signup = async (req, res, next) => {
  logHTTPRequest('/auth/signup', req.ip);
  try {
    const { IAM } = req.body;
    req.body.password = bcryptjs.hashSync(req.body.password, 10);

    // Check if IAM is a member IAM
    const verified = await isMemberIAM(IAM.toLowerCase());
    const newUser = new User({ ...req.body, verified });
    await newUser.save();

    // Remove message
    const message = 'User created successfully';
    res.status(201).json({ message, user: newUser });
    logUserAction({
      IP: req.ip,
      IAM: IAM,
      userID: newUser._id,
      message,
    });
  } catch (error) {
    logServerError(error.message);
    res.status(500).json({ error });
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  const parser = new UAParser();
  const ua = req.headers['user-agent'];
  const parsedUA = parser.setUA(ua).getResult();

  const deviceInfo = {
    os: parsedUA.os.name,
    os_version: parsedUA.os.version,
    browser: parsedUA.browser.name,
    browser_version: parsedUA.browser.version,
    device: parsedUA.device.model || 'Unknown device',
    is_mobile: parsedUA.device.type === 'mobile',
    is_tablet: parsedUA.device.type === 'tablet',
    is_pc: parsedUA.device.type === 'desktop' || !parsedUA.device.type // Default to desktop if no type is detected
  };

  const IP = req.ip;
  logHTTPRequest('/auth/signin', IP);

  try {
    let { IAM, password, code, rememberMe } = req.body;
    IAM = IAM.toLowerCase();

    const { success: validPassword, statusCode, statusText, user } = await validatePassword(IAM, password, code);

    if (!validPassword) {
      logUserError({
        IP,
        errorCode: statusCode,
        IAM,
        userID: user?._id,
        message: `User failed to sign in: ${statusText}`,
      });
      throw errorHandler(statusCode, statusText);
    }

    if (!user.verified && ['admin', 'member', 'loge'].some(role => user.roles.includes(role))) {
      logUserError({
        IP,
        IAM,
        userID: user._id,
        message: 'User failed to sign in: User is not verified',
      });
      throw errorHandler(401, 'User is not verified');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '30d' : '1h' });
    const { password: hashedPassword, twoFactorAuthSecret, ...rest } = user._doc;
    const expiryDate = rememberMe ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : new Date(Date.now() + 1000 * 60 * 30); // 30 days or 30 minutes


    // Create session document in MongoDB
    const session = new Session({
      userId: user._id,
      token,
      ipAddress: IP,
      userAgent: ua,
      deviceInfo,
      lastActive: new Date(),
      expiresAt: expiryDate,
      rememberMe,
    });

    await session.save();

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      expires: expiryDate
    }).status(200).json(rest);

    logUserAction({
      IP,
      IAM,
      userID: user._id,
      message: 'User signed in successfully',
    });

  } catch (error) {
    logServerError(error.message);
    next(error.message);
  }
};

// Sign Out
export const signout = async (req, res) => {
  logHTTPRequest('/auth/signout', req.ip);
  const token = req.cookies.access_token;

  // Check if the session exists in the database
  const session = await Session.findOne({ token });

  if (!session) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    }).status(200).json('Signout success!');

    console.log('Signout success!');
  } else {
    res.clearCookie('access_token').status(200).json('Signout success!');

    // Delete session document in MongoDB
    await Session.deleteOne({ token });

    console.log('Signout success! Session deleted from MongoDB');
  }


  logUserAction({
    IP: req.ip,
    message: 'User signed out successfully',
  });
};

// Validate
export const validate = async (req, res, next) => {
  logHTTPRequest('/auth/validate', req.ip);

  // Extract token from request cookies
  const token = req.cookies.access_token;

  // Check if token exists
  if (!token) {
    // Log error and return authentication error if token is missing
    logUserError({
      message: 'Validation failed: No token provided',
      errorCode: 401,
      IP: req.ip,
    });
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  try {
    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is invalid
    if (!decoded) {
      // Log error and return token validation error
      logUserError({
        message: 'Validation failed: Invalid token',
        errorCode: 403,
        IP: req.ip,
      });
      return next(errorHandler(403, 'Token is not valid!'));
    }

    // Find session corresponding to the token
    const session = await Session.findOne({ token });

    // Check if session exists
    if (!session) {
      // Clear invalid token cookie, log error, and return session not found error
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      logUserError({
        message: 'Validation failed: Session not found',
        errorCode: 403,
        IP: req.ip,
      });
      return next(errorHandler(403, 'Session is not valid!'));
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      // Clear expired token cookie, log error, delete session, and return session expired error
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      logUserError({
        message: 'Validation failed: Session has expired',
        errorCode: 403,
        IP: req.ip,
      });

      await Session.findOneAndDelete({ token });

      return next(errorHandler(403, 'Session has expired!'));
    }

    // Update session last active date
    session.lastActive = new Date();
    await session.save();

    // Check if session creation date is older than 30 days
    if (new Date() > new Date(session.createdAt).setDate(new Date(session.createdAt).getDate() + 30)) {
      // Clear expired token cookie, log error, delete session, and return session expired error
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });

      logUserError({
        message: 'Validation failed: Session has expired',
        errorCode: 403,
        IP: req.ip,
      });

      await Session.findOneAndDelete({ token });

      return next(errorHandler(403, 'Session has expired!'));
    }

    // Check if it's not a "remember me" session
    if (!session.rememberMe) {
      // Check if session creation date is older than 24 hours
      if (new Date() > new Date(session.createdAt).setDate(new Date(session.createdAt).getDate() + 1)) {
        // Clear expired token cookie, log error, delete session, and return session expired error
        res.clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
        });

        logUserError({
          message: 'Validation failed: Session has expired',
          errorCode: 403,
          IP: req.ip,
        });

        await Session.findOneAndDelete({ token });

        return next(errorHandler(403, 'Session has expired!'));
      }

      // Reset expiration time to 30 minutes from now
      let newExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

      const creationDate = new Date(session.createdAt);

      // Ensure session never exceeds 24 hours from creation
      if (new Date() > creationDate.setDate(new Date(creationDate).getDate() + 1)) {
        // Set expiration time to 24 hours from creation
        newExpiresAt = new Date(creationDate + 1000 * 60 * 60 * 24);
      }

      // Update session expiration and last active time
      session.expiresAt = newExpiresAt;
      session.lastActive = new Date();
      await session.save();
    }

    // Respond with successful validation
    res.status(200).json({ valid: true });

    // Log successful validation
    logUserAction({
      IP: req.ip,
      message: 'Validation successful, session extended by 30 minutes',
    });
  } catch (err) {
    // Clear invalid token cookie, log error, and return token validation error
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    logUserError({
      message: 'Validation failed: Token is not valid',
      errorCode: 403,
      IP: req.ip,
    });
    return next(errorHandler(403, 'Token is not valid!'));
  }
};

// Add a forgot password and reset password function
/**
 * Forgot password function
 * @param {object} req The request object containing user's email
 * @param {object} res The response object
 * @param {object} next The next middleware function
 */
export const forgotPassword = async (req, res) => {
  logHTTPRequest('/auth/forgot-password', req.ip);
  const { email, otp } = req.body;
  try {
    // Get the user 
    const user = await User.findOne({ email });
    if (!user) {
      logUserError({
        IP: req.ip,
        message: 'Password forgot failed: User not found',
        errorCode: 404,
      })
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if the user has a password
    if (user.twoFactorAuth) {
      const verified = validate2FaCode(user.twoFactorAuthSecret, otp);
      if (!verified) {
        logUserError({
          IP: req.ip,
          message: 'Password forgot failed: Invalid two-factor authentication code',
          errorCode: 401,
          IAM: user.IAM,
          userID: user._id,
        })
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
    logUserAction({
      IP: req.ip,
      message: 'Password reset token sent to email',
      IAM: user.IAM,
      userID: user._id,
    });
  } catch (error) {
    logServerError(error.message);
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
  logHTTPRequest('/auth/reset-password', req.ip);
  const { token, newPassword, totp } = req.body;

  // TODO: Implement TOTP validation
  try {
    // Find the reset token in the database
    const resetRecord = await ResetPassword.findOne({ token });

    if (!resetRecord) {
      logUserError({
        IP: req.ip,
        message: 'Password reset failed: Invalid or expired token',
        errorCode: 400,
      })
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Token is valid, find the user by email
    const { email } = resetRecord;
    const user = await User.findOne({ email });

    if (!user) {
      logUserError({
        IP: req.ip,
        message: 'Password reset failed: User not found',
        errorCode: 404,
      })

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
    sendSecurityEmailPasswordReset({ email, user: { IAM: user.IAM, firstName: user.firstName, lastName: user.lastName } });

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });

    logUserAction({
      IP: req.ip,
      IAM: user.IAM,
      userID: user._id,
      message: 'Password reset successful',
    });
  } catch (error) {
    logServerError(error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
    });
  };
};

export const addTwoFactorAuthentication = async (req, res) => {
  logHTTPRequest('/auth/2fa/add', req.ip);
  try {
    // Get the user from the request, assuming you are sending user ID in the request
    const { IAM } = req.body;

    // Generate a new secret for the user
    const secret = speakeasy.generateSecret({ length: 20 });

    const user = await User.findOne({ IAM: IAM.toLowerCase() });
    if (!user) {
      logUserError({
        IP: req.ip,
        message: 'Two-factor authentication addition failed: User not found',
        errorCode: 404,
      });
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if 2fa is enabled for the user
    if (user.twoFactorAuth) {
      logUserError({
        IP: req.ip,
        message: 'Two-factor authentication addition failed: User already has 2fa enabled',
        errorCode: 400,
      });
      return res.status(400).json({ error: 'Two-factor authentication is already enabled' });
    }

    // Save the secret key to the user document in the database
    await User.findOneAndUpdate({
      IAM: IAM.toLowerCase(),
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
        logServerError(err.message);
        return res.status(500).json({ error: 'Could not generate QR code' });
      }

      logUserAction({
        IP: req.ip,
        IAM: user.IAM,
        userID: user._id,
        message: 'Two-factor authentication addition successful: QR code generated',
      })
      // Return the QR code URL
      return res.json({ dataUrl });
    });
  } catch (error) {
    logServerError(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const validateTwoFactorCode = async (req, res) => {
  logHTTPRequest('/auth/2fa/validate', req.ip);
  try {
    const { IAM, code } = req.body;

    // Find the user by ID
    const user = await User.findOne({ IAM: IAM.toLowerCase() });

    // Check if user has a secret key for 2FA
    if (!user.twoFactorAuthSecret) {
      logUserError({
        IP: req.ip,
        message: 'Two-factor authentication validation failed: User does not have a secret key',
        errorCode: 400,
      });
      return res.status(400).json({ error: 'Two-factor authentication not set up' });
    }

    // Verify the entered code
    const verified = validate2FaCode(user.twoFactorAuthSecret, code);

    if (verified) {
      // Code is valid, you can now enable 2FA for the user
      await User.findOneAndUpdate({
        IAM: IAM.toLowerCase(),
      }, {
        $set: { twoFactorAuth: true }
      });

      logUserAction({
        IP: req.ip,
        IAM: user.IAM,
        userID: user._id,
        message: 'Two-factor authentication enabled successfully',
      });
      return res.json({ message: 'Two-factor authentication enabled successfully' });
    } else {
      logUserError({
        IP: req.ip,
        message: 'Two-factor authentication validation failed: Invalid code',
        errorCode: 400,
        IAM: user.IAM,
        userID: user._id,
      });
      return res.status(400).json({ error: 'Invalid two-factor authentication code' });
    }
  } catch (error) {
    logServerError(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const removeTwoFactorAuthentication = async (req, res) => {
  logHTTPRequest('/auth/2fa/remove', req.ip);
  try {
    const { IAM, code, password } = req.body;

    if (!IAM) return res.status(400).json({ error: 'Missing IAM' });
    if (!code) return res.status(400).json({ error: 'Missing code' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    // Validate password
    const { statusCode, statusText, success: validPassword, user } = await validatePassword(IAM.toLowerCase(), password, code);
    if (!validPassword) {
      logUserError({
        IP: req.ip,
        message: 'Two-factor authentication removal failed: Invalid password',
        errorCode: statusCode,
      });
      return res.status(statusCode).json({ error: statusText });
    }

    await User.findOneAndUpdate({
      IAM: IAM.toLowerCase(),
    }, {
      $set: {
        twoFactorAuth: false,
        twoFactorAuthSecret: undefined,
      },
    });

    logUserAction({
      IP: req.ip,
      IAM: IAM.toLowerCase(),
      message: 'Two-factor authentication removed successfully',
      userID: user._id,
    });
    return res.status(200).json({ message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    logServerError(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
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
    logServerError(error.message);
    throw errorHandler(500, 'Internal Server Error');
  }
}

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
  const user = await User.findOne({ IAM: IAM.toLowerCase() });
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

const getCityFromCoordinates = async (latitude, longitude) => {
  const url = `https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?lat=${latitude}&lng=${longitude}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'address-from-to-latitude-longitude.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    return result.Results;
  } catch (error) {
    console.error(error);
  }
};