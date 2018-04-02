const se = require('./safe-extract')
const DURATION_IN_TRAFFIC = 'duration_in_traffic'
const ERROR_MESSAGE = 'error_message'
const DISTANCE = 'distance'
const VALUE = 'value'
const JSON_STRING = 'json'
const ROUTES = 'routes'
const LEGS = 'legs'
const RESULTS = 'results'
const GEOMETRY = 'geometry'
const LOCATION = 'location'
const LAT = 'lat'
const LNG = 'lng'

const responseParser = (body) => {
  const route = se.nestedExtract(body, JSON_STRING, ROUTES, 0, LEGS, 0)
  const result = {
    duration: se.nestedExtract(route, DURATION_IN_TRAFFIC, VALUE),
    distance: se.nestedExtract(route, DISTANCE, VALUE)
  }
  return result
}

const errorParser = (err) => {
  let message = se.nestedExtract(err, JSON_STRING, ERROR_MESSAGE)
  message = message || 'One of the addresses may not be accurate. Verify they are correct.'
  const result = {
    error_message: message
  }
  return result
}

const geoResponseParser = (body) => {
  const route = se.nestedExtract(body, JSON_STRING, RESULTS, 0, GEOMETRY, LOCATION);
  const result = {
    latitude: se.nestedExtract(route, LAT),
    longitude: se.nestedExtract(route, LNG)
  }
  return result;
}

const geoErrorParser = (err) => {
  let message =  se.nestedExtract(err, JSON_STRING, ERROR_MESSAGE);
  message = message ? message: "The address may not be accurate. Verify it is correct.";
  const result = {
    error_message: message
  }
  return result;
}

module.exports = {
  responseParser: responseParser, 
  errorParser: errorParser,
  geoResponseParser: geoResponseParser,
  geoErrorParser: geoErrorParser
}
