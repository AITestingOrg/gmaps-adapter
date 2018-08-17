const handlers = require('./handlers/rabbitmq-handlers')
const rabbitmqUtils = require('./utils/rabbitmq-utils.js')
const rabbitmqConsumer = require('./utils/rabbitmq-consumer')
const restify = require('restify')
const routes = require('./routes/routes.js')
const waitSubscribe = require('./utils/eureka-subscription.js')
const winston = require('winston')

const port = process.env.PORT || 8080
const app = restify.createServer()

app.use(restify.plugins.bodyParser())
routes(app)

waitSubscribe()

rabbitmqUtils.waitForRabbitMQ(() => {
  rabbitmqConsumer.initializeConsumer('trip.exchange.tripcalculation', 'topic', 'trip.queue.gmapsadapter.estimatetrip', 'trip.estimation.estimaterequested', handlers.getDirections)
})

app.listen(port, () => {
  winston.log('info', `${app.name} listening at ${app.url}`)
})
