const Eureka = require('eureka-js-client').Eureka
const winston = require('winston')
const ip = require('ip')
const request = require('request')

const port = process.env.PORT || 8080
const addr = ip.address()
const url = 'http://discoveryservice:8761/eureka/'

const eureka = new Eureka({
  instance: {
    instanceId: 'gmapsadapter',
    app: 'gmapsadapter',
    hostName: addr,
    ipAddr: addr,
    homePageUrl: `http://${addr}:${port}`,
    statusPageUrl: `http://${addr}:${port}/api/v1/status`,
    healthcheckUrl: `http://${addr}:${port}/api/v1/status`,
    port: {
      '$': port,
      '@enabled': true
    },
    vipAddress: addr,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: process.env.EUREKA_SERVER || 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
})
eureka.logger.level('debug')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitReadyAndSubscribe () {
  winston.log('info', 'Waiting for eureka server to be up')
  let eurekaReady = false
  while (!eurekaReady) {
    await sleep(5000)
    request(url, (error, response, body) => {
      if (!error) {
        eurekaReady = true
      }
    })
  }

  eureka.start((error) => {
    if (error) {
      winston.log('error', error)
    }
  })
}

module.exports = waitReadyAndSubscribe
