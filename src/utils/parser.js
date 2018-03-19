const se = require('./safe-extract');
const DURATION_IN_TRAFFIC = 'duration_in_traffic',
  ERROR_MESSAGE = 'error_message'
  DURATION = 'duration',
  DISTANCE = 'distance',
  VALUE = 'value',
  JSON_STRING = 'json',
  ROUTES = 'routes',
  LEGS = 'legs';

const responseParser = (body) => {
  const route = se.nestedExtract(body, JSON_STRING, ROUTES, 0, LEGS, 0);
  const result = {
    duration: se.nestedExtract(route, DURATION_IN_TRAFFIC, VALUE),
    distance: se.nestedExtract(route, DISTANCE, VALUE)
  }
  return result;
}

const errorParser = (err) => {
  let message =  se.nestedExtract(err, JSON_STRING, ERROR_MESSAGE);
  message = message ? message: "One of the addresses may not be accurate. Verify they are correct.";
  const result = {
    error_message: message
  }
  return result;
}

module.exports = {
  responseParser: responseParser, 
  errorParser: errorParser
}