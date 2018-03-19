const parser = require('./../parser/direction.js');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
});

const directions = (req, res) => {
  googleMapsClient.directions(req.body, 
    (err, response) => {
      if(!err) {
        res.send(parser.responseParser(response));
      } else {
        err.status = 400;
        res.send(400, err);
      }
    }
  );
}

module.exports = (app) => {
  app.post('/directions', directions);
}