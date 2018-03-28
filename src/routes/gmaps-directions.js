const parser = require('./../utils/parser.js');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
  });


const directions = (req, res) => {
  googleMapsClient.directions(req.body,
    (err, response) => {
      if (!err) {
        res.send(parser.responseParser(response));
      } else {
        const parsedError = parser.errorParser(err);
        res.send(400, parsedError);
      }
    }
  );
};

const geocode = (req, res) => {
  googleMapsClient.geocode(req.body,
    (err, response) => {
      if (!err) {
        res.send(parser.geoResponseParser(response));
      } else {
        res.send(400, parser.geoErrorParser(err));
      }
    }
  );
};

const status = (req, res) => {
  res.send(200, { alive: true });
};

module.exports = (app) => {
  app.post('/api/v1/directions', directions);
  app.post('/api/v1/geocode', geocode);
  app.get('/api/v1/status', status);
}