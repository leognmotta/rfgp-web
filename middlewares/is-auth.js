const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }

  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  let decodedToken;

  if (bearer !== 'Bearer') {
    const error = new Error('JWT malformed');
    error.statusCode = 401;
    throw error;
  }

  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  return next();
};
