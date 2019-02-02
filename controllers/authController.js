const crypto = require('crypto');

const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY
    }
  })
);

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!email || !password || !name) {
      const error = new Error('Empty field');
      error.statusCode = 401;
      error.message = 'Please fill all fields';
      throw error;
    }

    if (await User.findOne({ email })) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      error.message = 'User already exists';
      throw error;
    }

    const user = await User.create(req.body);

    let emailToken = createEmailToken() + `${user._id.toString()}`;
    user.emailToken = emailToken;
    await user.save();
    user.password = undefined;

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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.authenticate = async (req, res, next) => {
  const { email, password } = req.body;

  try {
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

const createEmailToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return token;
};
