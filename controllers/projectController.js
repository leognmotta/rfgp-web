exports.default = (req, res, next) => {
  res.json({ authorized: 'true', userId: req.userId });
};
