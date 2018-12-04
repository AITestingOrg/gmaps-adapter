const rabbitmqPublisher = require('../utils/rabbitmq-publisher')
const winston = require('winston')
const parser = require('../utils/parser.js')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyA-A_VJjmiAKM-xwZpv7RdxDKkV5hzMh4Y'
})

function describeMessage (msg) {
  winston.log('info', 'Msg received: ' + msg.content.toString())
}

function getDirections (msg) {
  describeMessage(msg)
  const trip = JSON.parse(msg.content.toString())
  winston.log('info', 'Requesting directions for google map with body:', trip.toString())
  const fixedBody = {
    origin: trip.origin,
    destination: trip.destination,
    departure_time: trip.departureTime
  }
  return new Promise(function (resolve, reject) {
    googleMapsClient.directions(
      fixedBody,
      (err, response) => {
        if (!err) {
          const parsed = parser.dirResponseParser(response)
          const estimation = {
            origin: trip.origin,
            destination: trip.destination,
            distance: parsed.distance,
            duration: parsed.duration,
            userId: trip.userId
          }
          var publishing = JSON.stringify(estimation)
          winston.log('info', 'JsonStringified: ' + msg + ' is being published')
          rabbitmqPublisher.publishMessage('trip.exchange.tripcalculation', 'trip.estimation.estimatecalculated', publishing)
          resolve(msg)
        } else {
          const parsedError = parser.dirErrorParser(err)
          winston.log('error', 'directions: ', parsedError)
          reject(parsedError)
        }
      }
    )
  })
}

module.exports = {
  getDirections: getDirections,
  describeMessage: describeMessage
}
