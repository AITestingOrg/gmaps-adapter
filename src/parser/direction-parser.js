const se = require('../utils/safe-extract');
const DURATION_IN_TRAFFIC = 'duration_in_traffic',
  DURATION = 'duration',
  DISTANCE = 'distance',
  VALUE = 'value',
  JSON_STRING = 'json',
  ROUTES = 'routes',
  LEGS = 'legs';

module.exports =  (body) => {
  console.log('Starting parser.');

  const result = {
    duration: se.nestedExtract(body, JSON_STRING, ROUTES, 0, LEGS, 0, DURATION_IN_TRAFFIC, VALUE),
    distance: se.nestedExtract(body, JSON_STRING, ROUTES, 0, LEGS, 0, DISTANCE, VALUE)
  }
  console.log(result);
  console.log('Exiting parser.')
  return result;
}
