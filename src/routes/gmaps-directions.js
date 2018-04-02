const parser = require('./../utils/parser.js');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
});

const winston = require('winston');

const directionsMapping = (req, res) => {
  winston.log('info', 'Requesting directions for google map with body:', req.body);
  googleMapsClient.directions(req.body, 
    (err, response) => {
      if(!err) {
        const parsed = parser.responseParser(response);
        res.send(parsed);
      } else {
        const parsedError = parser.errorParser(err);
        winston.log('error', parsedError);
        res.send(400, parsedError);
      }
    }
  );
}

const status = (req, res) => {
  res.send(200, {alive: true});
}

module.exports = (app) => {
  app.post('/api/v1/directions', directionsMapping);
  app.get('/api/v1/status', status);
}