'use strict'

const parser = require('./../parser/direction-parser.js');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
});

const directions = (req, res) => {
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