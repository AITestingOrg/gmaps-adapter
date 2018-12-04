const parser = require('./../utils/parser.js')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyA-A_VJjmiAKM-xwZpv7RdxDKkV5hzMh4Y'
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
        const parsed = parser.dirResponseParser(response)
        res.send(parsed)
      } else {
        const parsedError = parser.dirErrorParser(err)
        winston.log('error', 'directions: ', parsedError)
        res.send(err) // forward original error to client
      }
    }
  )
}

const geocode = (req, res) => {
  googleMapsClient.geocode(req.body,
    (err, response) => {
      if (!err) {
        if (response.json.status === 'OK') {
          res.send(parser.geoResponseParser(response))
        } else {
          winston.log('error', 'geocode: No results')
          res.send(400, {results: 'No results'})
        }
      } else {
        const parsedError = parser.geoErrorParser(err)
        winston.log('error', 'geocode: ', parsedError)
        res.send(400, parsedError)
      }
    }
  )
}

const status = (req, res) => {
  res.send(200, { alive: true })
}

module.exports = (app) => {
  app.post('/api/v1/directions', directionsMapping)
  app.post('/api/v1/geocode', geocode)
  app.get('/api/v1/status', status)
}
