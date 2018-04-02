const parser = require('./../utils/parser.js')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
})

const winston = require('winston')

const directionsMapping = (req, res) => {
  winston.log('info', 'Requesting directions for google map with body:', req.body)
  const fixedBody = {
    origin: req.body.origin,
    destination: req.body.destination,
    departure_time: req.body.departureTime
  }
  googleMapsClient.directions(fixedBody,
    (err, response) => {
      if (!err) {
        const parsed = parser.responseParser(response)
        res.send(parsed)
      } else {
        const parsedError = parser.errorParser(err)
        winston.log('error', parsedError)
        res.send(400, parsedError)
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
  app.post('/api/v1/directions', directionsMapping);
  app.post('/api/v1/geocode', geocode);
  app.get('/api/v1/status', status);
}
