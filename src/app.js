var restify = require('restify');

var app = restify.createServer();
app.use(restify.plugins.bodyParser());

var routes = require('./routes/gmaps-directions.js');
routes(app);

app.listen(8080, () => {
  console.log('%s listening at %s', app.name, app.url);
});