const axios = require('axios');

exports.getProductsByTitle = async (req, res, next) => {
  try {
    const title = req.params.title;

    const product = await axios.get(`http://localhost:8000/produtos/${title}`);

    if (product.data.produtos.length < 1) {
      const error = new Error('Nenhum produto encontrado!');
      error.status = 400;
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

    console.log(codebar);

    const product = await axios.get(`http://localhost:8000/produtos/codebar/${codebar}`);

    console.log(product.data.produtos);
    if (!product.data.produtos || product.data.produtos === 'Nenhum produto encontrado!') {
      const error = new Error('Nenhum produto encontrado!');
      error.status = 404;
      throw error;
    }

    return res.status(200).json(product.data);
  } catch (error) {
    next(error);
  }
};
