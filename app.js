const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@cluster0-sud5s.mongodb.net/${process.env.DB_CLUSTER}`,
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
