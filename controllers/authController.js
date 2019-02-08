const crypto = require('crypto');

const User = require('../models/user');
const Store = require('../models/store');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../configs/sendgrid');

exports.register = async (req, res, next) => {
  try {
    const { name, lastName, email, password, storeName } = req.body;

    if (!email || !password || !name || !lastName || !storeName) {
      const error = new Error(
        'Campo vazio, por favor preencha todos os campos!'
      );
      error.statusCode = 400;
      throw error;
    }

    if (await User.findOne({ email })) {
      const error = new Error('Usuário já cadastrado com este email!');
      error.statusCode = 400;
      throw error;
    }

    // Create a new User
    const newUser = {
      name: name,
      lastName: lastName,
      email: email,
      password: password
    };
    const user = await User.create(newUser);
    // Create emailToken
    let emailToken =
      crypto.randomBytes(16).toString('hex') + `${user._id.toString()}`;
    user.emailToken = emailToken;

    // Create a new Store
    const newStore = { storeName: storeName, users: [{ userId: user._id }] };
    await Store.create(newStore);

    // Set emailToken
    await User.findOneAndUpdate(user.email, {
      $set: { emailToken: emailToken }
    });
    user.password = undefined;

    // Send email
    transporter.sendMail({
      to: { name: user.name, address: user.email },
      from: { address: 'no-reply@rfgpweb.com.br', name: 'rfgpweb' },
      subject: 'Cadastro concluido, por favor confirme seu email!',
      html: `
        <h1>Cadastro completo!</h1>
        <p>O seu cadastro foi concluido com sucesso, no entanto precisamos que confira seu email clicando no link abaixo: </p>
        <a href="http://localhost:8080/config/confirm-email/${
          user.emailToken
        }">http://localhost:8080/config/confirm-email/${user.emailToken}</a>
      `
    });
    return res
      .status(201)
      .json({ message: 'User created', userId: user._id.toString() });
  } catch (error) {
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error('Empty field');
      error.statusCode = 401;
      error.message = 'Please fill all fields';
      throw error;
    }

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

exports.sendResetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 400;
      error.message = 'User not found, could not send reset password email.';
      throw error;
    }

    const token =
      crypto.randomBytes(20).toString('hex') + `${user._id.toString()}`;

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await User.findByIdAndUpdate(user._id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: expirationDate
      }
    });

    transporter.sendMail({
      to: { name: user.name, address: user.email },
      from: { address: 'no-reply@rfgpweb.com.br', name: 'rfgpweb' },
      subject: 'Resetar senha',
      html: `
        <h1>Esqueceu sua senha?</h1>
        <p> Resete sua senha clicando no link abaixo: </p>
        <a href="http://localhost:8080/auth/send-reset-password/${token}">http://localhost:8080/auth/send-reset-password/${token}</a>
      `
    });

    return res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { passwordResetToken } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ passwordResetToken });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.message = 'Could not find user';
      throw error;
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      const error = new Error('Token expired!');
      error.statusCode(400);
      error.message = 'Token expired!';
      throw error;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
