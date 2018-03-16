'use strict'

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
});

var directions = (req, res) => {
  googleMapsClient.directions(req.body, 
    (err, response) => {
      if(!err) {
        res.send(response);
      } else {
        res.send(err);
      }
    }
  );
}

module.exports = (app) => {
  app.post('/directions', directions);
}