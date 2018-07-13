const restify = require('restify')
const routes = require('./routes/routes.js')
const winston = require('winston')
const waitSubscribe = require('./utils/eureka-subscription.js')
const rabbitmqUtils = require('./utils/rabbitmq-utils.js')
const parser = require('./utils/parser.js')
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyBrbHj2dKR_VIWZDRGqdMLaq99YP-yHwxY'
})

const port = process.env.PORT || 8080
const app = restify.createServer()

function consumeAndDescribeMessage (msg) {
  winston.log('info', 'Msg received: ' + msg.content.toString())
  const json = JSON.parse(msg.content.toString())
  getDirections(json)
}

function getDirections (trip) {
  winston.log('info', 'Requesting directions for google map with body:', trip.toString())
  const fixedBody = {
    origin: trip.origin,
    destination: trip.destination,
    departure_time: trip.departureTime
  }
  googleMapsClient.directions(
    fixedBody,
    (err, response) => {
      if (!err) {
        const parsed = parser.dirResponseParser(response)
        const estimation = {
          originAddress: trip.origin,
          destinationAddress: trip.destination,
          distance: parsed.distance,
          duration: parsed.duration
        }
        var msg = JSON.stringify(estimation)
        winston.log('info', 'JsonStringified: ' + msg + ' is being published')
        rabbitmqUtils.publishMessage('trip.exchange.tripcalculation', 'trip.estimation.estimatecalculated', msg)
      } else {
        const parsedError = parser.dirErrorParser(err)
        winston.log('error', 'directions: ', parsedError)
      }
    }
  )
}

function initializeExchangesAndQueues () {
  rabbitmqUtils.initializeConsumer('trip.exchange.tripcalculation', 'topic', 'trip.queue.gmapsadapter.estimatetrip', 'trip.estimation.estimaterequested', consumeAndDescribeMessage)
}

app.use(restify.plugins.bodyParser())

routes(app)
waitSubscribe()
rabbitmqUtils.waitForRabbitMQ(initializeExchangesAndQueues)
winston.log('test message to see if build is built')
app.listen(port, () => {
  winston.log('info', `${app.name} listening at ${app.url}`)
})
