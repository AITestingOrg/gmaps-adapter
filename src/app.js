const restify = require('restify')
const routes = require('./routes/gmaps-directions.js')
const winston = require('winston')
const waitSubscribe = require('./utils/eureka-subscription.js')

const port = process.env.PORT || 8080
const app = restify.createServer()
app.use(restify.plugins.bodyParser())

routes(app)
waitSubscribe()

app.listen(port, () => {
  winston.log('info', `${app.name} listening at ${app.url}`)
})
