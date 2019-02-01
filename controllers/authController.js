const User = require('../models/user');

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
    return res.status(201).send({ user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
