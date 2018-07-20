const amqp = require('amqplib/callback_api')
const winston = require('winston')

function publishMessage (exchangeName, routingKey, msg) {
  var msgToSend = Buffer.from(msg, 'utf-8')
  var rabbitHost = process.env.RABBIT_HOST || 'localhost'
  var rabbitUsername = process.env.RABBIT_USERNAME || 'guest'
  var rabbitPassword = process.env.RABBIT_PASSWORD || 'guest'
  winston.log('info', 'before dialing rabbitmq. Attempting to connect to: amqp://' + rabbitUsername + ':' + rabbitPassword + '@' + rabbitHost + ':5672/')
  amqp.connect('amqp://' + rabbitUsername + ':' + rabbitPassword + '@' + rabbitHost + ':5672/', function (err, conn) {
    conn.createChannel(function (err, ch) {
      ch.assertExchange(
        exchangeName,
        'topic',
        {durable: true, autoDelete: false, internal: false, nowait: false, args: null}
      )
      ch.publish(exchangeName, routingKey, msgToSend)
      ch.close()
    })
  })
}

//   ch.assertExchange(
//     exchangeName,
//     'topic',
//     {durable: true, autoDelete: false, internal: false, nowait: false, args: null}
//   )
//   ch.publish(exchangeName, routingKey, msgToSend)

//   winston.log('info', 'Published message:' + msg.toString() + ' to exchange: ' + exchangeName + ' with routingKey: ' + routingKey)
// }

// module.exports = {
//   publishMessage: publishMessage
// }

// function initializeChannel () {
//   amqp.connect('amqp://' + (process.env.RABBIT_USERNAME || 'guest') + ':' + (process.env.RABBIT_PASSWORD || 'guest') + '@' + (process.env.RABBIT_HOST || 'localhost') + ':5672/', function (err, conn) {
//     conn.createChannel(function (err, ch) {})
// })
// }

// const ch = initializeChannel()
