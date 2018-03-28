const parser = require('./../utils/parser.js');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
  });

const directionsMapping = (req, res) => {
  googleMapsClient.directions(req.body, 
    (err, response) => {
      if(!err) {
        const parsed = parser.responseParser(response);
        res.send(parsed);
      } else {
        const parsedError = parser.errorParser(err);
        res.send(400, parsedError);
      }
    }
  );
}

module.exports = (app) => {
  app.post('/directions', directionsMapping);
}