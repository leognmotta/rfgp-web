const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, status: status });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@cluster0-sud5s.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true }
  )
  .then(result => {
    app.listen(process.env.PORT, () => {
      console.log(`App listening on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
