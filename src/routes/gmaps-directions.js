const directionMapping = require('./direction-mapping.js');

module.exports = (app) => {
  app.post('/directions', directionsMapping);
}