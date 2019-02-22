const server = require('./app');

server.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${process.env.PORT || 8080}`);
});
