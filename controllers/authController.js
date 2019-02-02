const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email })) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      error.message = 'User already exists';
      throw error;
    }

    const user = await User.create(req.body);
    user.password = undefined;
    return res
      .status(201)
      .json({ message: 'User created', userId: user._id.toString() });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('User not registered');
      error.statusCode = 400;
      error.message = 'User not registered';
      throw error;
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      const error = new Error('Invalid password');
      error.statusCode = 400;
      error.message = 'Invalid password';
      throw error;
    }

    user.password = undefined;

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      `${process.env.JWT_SECRET}`,
      { expiresIn: '3h' }
    );

    return res.status(200).json({ userId: user._id.toString(), token: token });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
