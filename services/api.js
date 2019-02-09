const axios = require('axios');

const api = axios.create({
  baseURL: 'https://rfgpwevtest.firebaseio.com'
});

module.exports = api;
