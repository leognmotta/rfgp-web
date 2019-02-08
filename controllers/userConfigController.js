const User = require('../models/user');

exports.confirmEmail = async (req, res, next) => {
  const emailToken = req.params.emailToken;

  try {
    const user = await User.findOne({ emailToken: emailToken });
    if (!user) {
      const error = new Error('Usuário não encontrado!');
      error.statusCode = 404;
      throw error;
    }

    if (user.emailChecked === true) {
      return res
        .status(200)
        .json({
          message: `Olá, ${user.name} ${
            user.lastName
          }, seu email já esta confirmado!`
        });
    }

    // user.emailChecked = true;
    // user.emailToken = undefined;
    await User.findByIdAndUpdate(user._id, {
      $set: {
        emailChecked: true,
        emailToken: undefined
      }
    });

    return res.status(201).json({
      message: `Olá, ${user.name} ${
        user.lastName
      }, seu email foi confirmado com sucesso!`
    });
  } catch (error) {
    next(error);
  }
};
