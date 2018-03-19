function extract(obj, key, defaultValue) {
  if(typeof defaultValue === 'undefined') {
    defaultValue = '';
  }
  if(obj == undefined || obj == null || key == undefined || key == null) {
    return defaultValue;
  }
  if(obj[key] && obj[key] != null) {
    defaultValue = obj[key];
  }
  return defaultValue;
}

function nestedExtract(obj, ...keys) {
  for(var i = 0; i < keys.length; i++) {
    obj = extract(obj, keys[i]);
    if(i + 1 > keys.length && (!obj.length || obj.length <= 0)) {
      return null;
    }
  }
  return obj;
}

module.exports = {
  extract: extract,
  nestedExtract: nestedExtract,
};