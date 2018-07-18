const winston = require('winston')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function rabbitMQHealthCheck (rabbitHost) {
  var request = new XMLHttpRequest()
  request.withCredentials = true
  request.open('GET', 'http://' + rabbitHost + ':15672/api/healthchecks/node', false, 'guest', 'guest')
  request.send(null)
  winston.log('info', 'RabbitMq health check resulted in status ' + request.status)
  return request.status === 200
}

async function waitForRabbitMQ (callbackFunc) {
  var rabbitReady = false
  var rabbitHost = process.env.RABBIT_HOST || 'localhost'
  while (!rabbitReady) {
    rabbitReady = rabbitMQHealthCheck(rabbitHost)
    if (!rabbitReady) {
      winston.log('info', 'Waiting for RabbitMQ: Sleeping 5 seconds')
      await sleep(5000)
    }
  }
  winston.log('info', 'RabbitMQ up')
  callbackFunc()
}

module.exports = {
  waitForRabbitMQ: waitForRabbitMQ
}
