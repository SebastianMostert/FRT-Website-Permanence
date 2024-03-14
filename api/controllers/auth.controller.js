import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import MemberIAM from '../models/memberIAM.model.js';

// Sign Up
export const signup = async (req, res, next) => {
  let { IAM, email, password, firstName, lastName } = req.body;
  IAM = IAM.toLowerCase(); // Convert IAM to lowercase
  const hashedPassword = bcryptjs.hashSync(password, 10);

  try {
    // Check if IAM is a member IAM
    const verified = await isMemberIAM(IAM);

    if (!verified) {
      throw errorHandler(400, 'Invalid IAM. User is not a member.');
    }

    const newUser = new User({ IAM, email, password: hashedPassword, firstName, lastName, verified });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  let { IAM, password } = req.body;
  IAM = IAM.toLowerCase(); // Convert IAM to lowercase

  try {
    const validUser = await User.findOne({ IAM });
    if (!validUser) {
      throw errorHandler(404, 'User not found');
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw errorHandler(401, 'Wrong credentials');
    }

    if (!validUser.verified) {
      throw errorHandler(401, 'Your account hasn\'t been verified yet!');
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    res
      .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Sign Out
export const signout = (req, res) => {
  res.clearCookie('access_token').status(200).json('Signout success!');
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
