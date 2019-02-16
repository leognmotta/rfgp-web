// Built in node.js
const http = require('http');

// Third part libs
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const passport = require('passport');
const pe = require('parse-error');
const cors = require('cors');
const mongoose = require('mongoose').set('debug', true);
const compression = require('compression');
const helmet = require('helmet');

// Middlerwares
const { catch404, errorHandler } = require('./middlewares/errors');

// Routes
const v1 = require('./routes/index.v1');

// Models

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors());
if (process.env.APP === 'production') {
  app.use(logger('combined'));
} else {
  app.use(logger('dev'));
}
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.xml({
    xmlParseOptions: {
      normalize: true,
      normalizeTags: true,
      explicitArray: false
    }
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

//Passport
app.use(passport.initialize());

// Use routes
app.use('/v1', v1);

// Catch 404 and foward to error handler
app.use(catch404);

// Error handler
app.use(errorHandler);

process.on('unhandledRejection', error => {
  console.log('Uncaught Error', pe(error));
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@cluster0-sud5s.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  )
  .then(result => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`App listening on port ${process.env.PORT || 8080}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
