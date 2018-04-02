const restify = require('restify');
const routes = require('./routes/gmaps-directions.js');
const eureka = require('./utils/eureka-subscription.js')

const port = process.env.PORT || 8080;
const app = restify.createServer();
app.use(restify.plugins.bodyParser());

routes(app);

app.listen(port, () => {
  console.log('%s listening at %s', app.name, app.url);
});
