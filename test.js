const bcrypt = require('bcrypt');

bcrypt.compare(
  '123456',
  'model$2b$10$wtnDJuKi7OTqetdCjNnBoulm4TvxbCQUuO00bH7n85nOR4LY.JCmK',
  function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  }
);
