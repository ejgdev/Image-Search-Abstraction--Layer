const customSearch = require('./customSearch.js');
const histories = require('./histories.js');

module.exports = (app) => {
  app.get('/api/imgSearch/:query',customSearch);
  app.get('/api/latest/imagesearch/',histories);
};