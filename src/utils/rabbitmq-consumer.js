const amqp = require('amqplib/callback_api')
const winston = require('winston')

function makeConsumerFunction (consumerFunction, ch) {
  function generatedConsumerFunction (msg) {
    var finished = consumerFunction(msg)
    finished.then(function (result) {
      ch.ack(msg)
    }, function (err) {
      winston.log('info', 'Error with consumer function promise: ' + err)
    })
  }
  return generatedConsumerFunction
}

function initializeConsumer (exchangeName, exchangeKind, queueName, queueBinding, consumerFunction) {
  var rabbitUsername = process.env.RABBIT_USERNAME || 'guest'
  var rabbitPassword = process.env.RABBIT_PASSWORD || 'guest'
  var rabbitHost = process.env.RABBIT_HOST || 'localhost'

  winston.log('info', `before dialing rabbitmq. Attempting to connect to: amqp://${rabbitUsername}:${rabbitPassword}@${rabbitHost}:5672/`)
  amqp.connect(`amqp://${rabbitUsername}:${rabbitPassword}@${rabbitHost}:5672/`, function (err, conn) {
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
          ch.consume(q.queue, makeConsumerFunction(consumerFunction, ch), {name: queueName, consumer: '', noAck: false, exclusive: false, noLocal: false, nowait: false, args: null})
        })
    })
  })
  winston.log('info', 'after dialing rabbitmq')
}

module.exports = {
  initializeConsumer: initializeConsumer
}
