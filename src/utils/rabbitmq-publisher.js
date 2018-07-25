const amqp = require('amqplib/callback_api')
const winston = require('winston')

let currentChannel = null;

function publishMessage (exchangeName, routingKey, msg) {

  var msgToSend = Buffer.from(msg, 'utf-8')
  var rabbitHost = process.env.RABBIT_HOST || 'localhost'
  var rabbitUsername = process.env.RABBIT_USERNAME || 'guest'
  var rabbitPassword = process.env.RABBIT_PASSWORD || 'guest'
  if (currentChannel !== null ) {
    console.log('Existing channel being published to')
    currentChannel.then(function(ch) {
      channelAssertionAndPublishing(ch, exchangeName, routingKey, msgToSend)
    })
  } else {
    winston.log('info', `before dialing rabbitmq. Attempting to connect to: amqp://${rabbitUsername}:${rabbitPassword}@${rabbitHost}:5672/`)
    amqp.connect(`amqp://${rabbitUsername}:${rabbitPassword}@${rabbitHost}:5672/`, function (err, conn) {
    if (err) {
      console.error(err)
      return
    }
    currentChannel = new Promise((resolve, reject) => {
      conn.createChannel(function(err, ch){
        if (err) {
          console.error(err)
          reject(err)
        }
        ch.on('close', function(err) {
          currentChannel = null
          console.log('Channel closed: ' + err)
        })  
        resolve(ch);
})})
    currentChannel.then(function(ch) {
      channelAssertionAndPublishing(ch, exchangeName, routingKey, msgToSend)
    })
  })
}
}

module.exports = {
  publishMessage: publishMessage
}

function channelAssertionAndPublishing (ch, exchangeName, routingKey, msgToSend) {
  console.log('Asserting the exchange and publishing the message to the channel')
  ch.assertExchange(
    exchangeName,
    'topic',
    {durable: true, autoDelete: false, internal: false, nowait: false, args: null}
  )
  ch.publish(exchangeName, routingKey, msgToSend)
}
