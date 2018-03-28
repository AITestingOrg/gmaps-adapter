const restify = require('restify');
const routes = require('./routes/gmaps-directions.js');
const Eureka = require('eureka-js-client').Eureka;

const port = process.env.PORT || 8080;

const app = restify.createServer();
app.use(restify.plugins.bodyParser());
routes(app);

const eureka = new Eureka({
  instance: {
    instanceId:'gmapsadapter',
    app: 'gmapsadapter',
    hostName: 'localhost',
    ipAddr: '0.0.0.0',
    statusPageUrl: `http://localhost:${port}/status`,
    healthcheckUrl: `http://localhost:${port}/status`,
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'localhost',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    }
  },
  eureka: {
    host: process.env.EUREKA_SERVER || 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  }
});
eureka.logger.level('debug');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitReady() {
  console.log("Waiting for eureka.");
  await sleep(25000);
  eureka.start((error) => {
    console.log(error || 'complete');
  });
}
waitReady();

app.listen(port, () => {
  console.log('%s listening at %s', app.name, app.url);
});
