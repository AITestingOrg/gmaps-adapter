const winston = require('winston')

const amqp = require('amqplib/callback_api')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

var rabbitReady = false

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function rabbitMQHealthCheck () {
  var request = new XMLHttpRequest()
  request.withCredentials = true
  request.open('GET', 'http://' + process.env.RABBIT_HOST + ':15672/api/healthchecks/node', false, 'guest', 'guest')
  request.send(null)
  winston.log('info', 'RabbitMq healtcheck returned' + request.responseText)
  return request.status === 200
}

async function waitForRabbitMQ (callbackFunc) {
  while (!rabbitReady) {
    winston.log('info', 'Waiting for RabbitMQ: Sleeping 5 seconds')
    await sleep(5000)
    rabbitReady = rabbitMQHealthCheck()
  }
  winston.log('info', 'RabbitMQ up')
  callbackFunc()
}

function publishMessage (exchangeName, routingKey, msg) {
  var msgToSend = Buffer.from(msg, 'utf-8')
  winston.log('info', 'before dialing rabbitmq. Attempting to connect to: amqp://guest:guest@' + process.env.RABBIT_HOST + ':5672/')
  amqp.connect('amqp://guest:guest@' + process.env.RABBIT_HOST + ':5672/', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertExchange(
        exchangeName,
        'topic',
        {durable: true, autoDelete: false, internal: false, nowait: false, args: null}
      )
      ch.publish(exchangeName, routingKey, msgToSend)
    })
  })
  winston.log('info', 'Published message:' + msg.toString() + ' to exchange: ' + exchangeName + ' with routingKey: ' + routingKey)
}

function initializeConsumer (exchangeName, exchangeKind, queueName, queueBinding, consumerFunction) {
  winston.log('info', 'before dialing rabbitmq. Attempting to connect to: amqp://guest:guest@' + process.env.RABBIT_HOST + ':5672/')
  amqp.connect('amqp://guest:guest@' + process.env.RABBIT_HOST + ':5672/', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertExchange(
        exchangeName,
        exchangeKind,
        {durable: true, autoDelete: false, internal: false, nowait: false, args: null}
      )
      ch.assertQueue(
        queueName,
        {name: queueName, durable: false, autoDelete: true, exclusive: false, nowait: false, args: null},
        function (err, q) {
          ch.bindQueue(queueName, exchangeName, queueBinding)
          ch.consume(q.queue, function (msg) { consumerFunction(msg) }, {name: queueName, consumer: '', noAck: true, exclusive: false, noLocal: false, nowait: false, args: null})
        })
    })
  })
  winston.log('info', 'after dialing rabbitmq')
}

module.exports = {
  initializeConsumer: initializeConsumer,
  waitForRabbitMQ: waitForRabbitMQ,
  publishMessage: publishMessage
}
