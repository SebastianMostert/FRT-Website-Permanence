import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import MemberIAM from '../models/memberIAM.model.js';

// Sign Up
export const signup = async (req, res, next) => {
  const { IAM, email, password, firstName, lastName } = req.body;
  console.log(req.body);
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Check if IAM is a member IAM 
  const verified = await isMemberIAM(IAM);

  const newUser = new User({ IAM, email, password: hashedPassword, firstName, lastName, verified });
  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Sign In
export const signin = async (req, res, next) => {
  const { IAM, password } = req.body;
  try {
    const validUser = await User.findOne({ IAM });
    if (!validUser) return next(errorHandler(404, 'User not found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));

    if (!validUser.verified) return next(errorHandler(401, 'You\'re account hasn\'t been verified yet!'));

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


async function isMemberIAM(IAM) {
  // Fetch the Member IAM
  const memberIAM = await MemberIAM.findOne({ IAM });

  if (!memberIAM) return false;
  if (memberIAM.IAM == IAM) return true;
  return false;
}