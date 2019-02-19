const bcrypt = require('bcrypt');
const crypto = require('crypto');

const User = require('../models/user');
const Store = require('../models/store');

const transporter = require('../config/sendgrid');

exports.postSignUp = async (req, res, next) => {
  try {
    const { name, lastName, email, password, storeName } = req.body;

    if (!name || !lastName || !email || !password || !storeName) {
      const error = new Error('Por favor preencha todos os campos.');
      error.status = 400;
      throw error;
    }

    if (await User.findOne({ email })) {
      const error = new Error('Este email já está cadastrado.');
      error.status = 400;
      throw error;
    }

    const store = await Store.create({ storeName });

    const user = await User.create({
      name: name,
      lastName: lastName,
      email: email,
      password: password,
      storeId: store._id
    });

    store.users.push({ userId: user._id });
    store.save();

    user.emailToken = user.createEmailToken();
    user.save();

    // Send email
    transporter.sendMail({
      to: { name: user.name, address: user.email },
      from: { address: 'no-reply@rfgpweb.com.br', name: 'rfgpweb' },
      subject: 'Cadastro concluido, por favor confirme seu email!',
      html: `
        <h1>Cadastro completo!</h1>
        <p>Ola ${
          user.name
        }, seu cadastro foi concluido com sucesso, no entanto precisamos que confirme o seu email clicando no link abaixo: </p>
        <a href="http://localhost:3000/validar-email/${
          user.emailToken
        }">http://localhost:3000/validar-email/${user.emailToken}</a>
      `
    });

    return res.status(201).json({
      message:
        'Usuário criado com sucesso, confirme seu email e não esqueça de checar a caixa de spam!'
    });
  } catch (error) {
    next(error);
  }
};

exports.postSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Por favor preencha todos os campos.');
      error.status = 400;
      throw error;
    }

    const user = await User.findOne({ email }).select('+password');

    let isPasswordEqual;
    if (user) isPasswordEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordEqual) {
      const error = new Error('Email ou senha inválidos.');
      error.status = 400;
      throw error;
    }

    const token = user.getToken();

    return res.status(200).json({ userId: user._id, token: token });
  } catch (error) {
    next(error);
  }
};

exports.putConfirmEmail = async (req, res, next) => {
  try {
    const emailToken = req.params.token;

    const user = await User.findOne({ emailToken: emailToken });
    if (!user) {
      const error = new Error('Usuário não encontrado!');
      error.status = 404;
      throw error;
    }

    if (user.emailChecked === true) {
      return res.status(200).json({
        message: `Olá, ${user.name} ${user.lastName}, seu email já esta confirmado!`
      });
    }

    await User.findByIdAndUpdate(user._id, {
      $set: {
        emailChecked: true
      },
      $unset: {
        emailToken
      }
    });

    return res.status(201).json({
      message: `Olá, ${user.name} ${user.lastName}, seu email foi confirmado com sucesso!`
    });
  } catch (error) {
    next(error);
  }
};

exports.postSendResetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.status = 400;
      throw error;
    }

    const token = crypto.randomBytes(20).toString('hex') + `${user._id.toString()}`;

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
        <a href="http://localhost:3000/resetar-senha/${token}">http://localhost:3000/auth/send-reset-password/${token}</a>
      `
    });

    return res.status(200).json({ message: 'Email enviado.' });
  } catch (error) {
    next(error);
  }
};

exports.putResetPassword = async (req, res, next) => {
  try {
    const passwordResetToken = req.params.token;
    const { password } = req.body;

    const user = await User.findOne({ passwordResetToken }).select('+passwordResetExpires');
    console.log(user);

    if (!user) {
      const error = new Error('Usuário não encontrado.');
      error.status = 404;
      throw error;
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      const error = new Error('Token expirado.');
      error.status = 400;
      throw error;
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

exports.getIsTokenValid = (req, res, next) => {
  const user = req.user;
  res.status(200).json({ user });
};
