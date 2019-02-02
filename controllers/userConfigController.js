const User = require('../models/user');

exports.confirmEmail = async (req, res, next) => {
  const emailToken = req.params.emailToken;

  try {
    const user = await User.findOne({ emailToken: emailToken });
    if (!user) {
      const error = new Error('No user found!');
      error.statusCode = 404;
      error.message = 'No user found!';
      throw error;
    }

    if (user.emailChecked === true) {
      return res
        .status(200)
        .json({ message: `${user.name}, seu email ja esta confirmado!` });
    }

    user.emailChecked = true;
    await User.findOneAndUpdate(user);

    return res.status(201).json({
      message: `Ola, ${user.name} seu e-mail foi confirmado com sucesso!`
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
