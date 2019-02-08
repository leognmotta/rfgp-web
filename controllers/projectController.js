exports.default = (req, res, next) => {
  res.json({ authorized: 'true', userId: req.userId });
};

exports.testXML = (req, res, next) => {
  const body = req.body.row;
  console.log(body);
  return res.status(200).json(body);
};
