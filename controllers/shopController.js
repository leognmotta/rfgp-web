const api = require('../services/api');
const axios = require('axios');

exports.getProductsByTitle = async (req, res, next) => {
  try {
    const title = req.params.title;

    const product = await axios.get(`http://localhost:8000/produtos/${title}`);

    if (!product) {
      const error = new Error('Nenhum produto encontrado!');
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json(product.data);
  } catch (error) {
    next(error);
  }
};

exports.getProductsByCodebar = async (req, res, next) => {
  try {
    const codebar = req.params.codebar;

    const product = await axios.get(
      `http://localhost:8000/produtos/codebar/${codebar}`
    );

    if (!product) {
      const error = new Error('Nenhum produto encontrado!');
      error.statusCode = 400;
      throw error;
    }

    return res.status(200).json(product.data);
  } catch (error) {
    next(error);
  }
};
