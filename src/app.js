var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var app = restify.createServer();
const restifyBodyParser = require('restify').plugins.bodyParser;
app.use(restifyBodyParser());

var routes = require('./routes/gmaps-directions.js');
routes(app);

app.listen(8080, function() {
  console.log('%s listening at %s', app.name, app.url);
});