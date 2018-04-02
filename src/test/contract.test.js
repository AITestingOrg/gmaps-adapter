const path = require('path')
const pact = require('@pact-foundation/pact-node')
const winston = require('winston')

const opts = {
  providerBaseUrl: 'http://localhost:8080',
  pactUrls: [path.resolve(__dirname, '../../pacts/my_consumer-posts_provider.json')]
}

pact.verifyPacts(opts).then(() => {
  winston.log('info', 'success')
  process.exit(0)
}).catch((error) => {
  winston.log('error', error)
  process.exit(1)
})
