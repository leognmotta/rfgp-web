const express = require('express');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const userConfigRoutes = require('./routes/userConfig');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.xml({
    xmlParseOptions: {
      normalize: true, // Trim whitespace inside text nodes
      normalizeTags: true, // Transform tags to lowercase
      explicitArray: false // Only put nodes in array if >1
    }
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/auth', authRoutes);
app.use('/shop', shopRoutes);
app.use('/config', userConfigRoutes);

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
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  )
  .then(result => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`App listening on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
