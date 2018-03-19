const parser = require('./../utils/parser.js');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
});

const directions = (req, res) => {
  googleMapsClient.directions(req.body, 
    (err, response) => {
      if(!err) {
        res.send(parser.responseParser(response));
      } else {
        res.send(400, parser.errorParser(err));
      }
    }
  );
}

module.exports = (app) => {
  app.post('/directions', directions);
}