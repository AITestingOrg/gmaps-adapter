const restify = require('restify');
const app = restify.createServer();
const routes = require('./routes/gmaps-directions.js');
const port = process.env.PORT || 8080;

app.use(restify.plugins.bodyParser());

routes(app);

app.listen(port, () => {
  console.log('%s listening at %s', app.name, app.url);
});