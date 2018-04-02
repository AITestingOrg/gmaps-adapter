const se = require('./safe-extract')
const DURATION_IN_TRAFFIC = 'duration_in_traffic'
const ERROR_MESSAGE = 'error_message'
const DISTANCE = 'distance'
const VALUE = 'value'
const JSON_STRING = 'json'
const ROUTES = 'routes'
const LEGS = 'legs'

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

module.exports = {
  responseParser: responseParser,
  errorParser: errorParser
}
