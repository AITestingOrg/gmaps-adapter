const se = require('../utils/safe-extract');
const ERROR_MESSAGE = 'error_message',
  HEADERS = 'headers',
  JSON_STRING = 'json';

module.exports = (err) => {
  let message =  se.nestedExtract(err, JSON_STRING, ERROR_MESSAGE);
  console.log(message);
  message = message ? message: "One of the addresses might not be accurate. Make sure they are correct.";
  console.log(message);
  const result = {
    error_message: message
  }
  return result;
}
