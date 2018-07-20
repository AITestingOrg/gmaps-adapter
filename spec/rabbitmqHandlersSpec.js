const rabbitmqHandlers = require('../src/handlers/rabbitmq-handlers')

// Test valid rabbitmq-handlers input
// Arrange
let innerContent = {
  origin: "Weston, Fl",
  destination: "Miami, Fl",
  departureTime: 12,
  userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
};
let content = Object.assign(innerContent, {
  toString: () => JSON.stringify(innerContent)
});

var validTrip = {
  content: content 
};

// Act
var answer = rabbitmqHandlers.getDirections(validTrip)
var resolves = true
answer.then(function (result) {
    resolves = true
}, function (err) {
    resolves = false
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should resolve the message', function () {
    expect(resolves).toEqual(true);
  });
});

// Test invalid rabbitmq-handlers input
// Arrange

let invalidInnerContent = {
  destination: "Miami, Fl",
  departureTime: 12,
  userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
};

let invalidContent = Object.assign(invalidInnerContent, {
  toString: () => JSON.stringify(invalidInnerContent)
});

var invalidTrip = {
  content: invalidContent
};

// Act
var answer = rabbitmqHandlers.getDirections(invalidTrip)
var rejects = true
answer.then(function (result) {
    rejects = false
}, function (err) {
    rejects = true
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should reject the message because missing field', function () {
    expect(rejects).toEqual(true)
  })
})

// Test invalid rabbitmq-handlers input
// Arrange
var invalidTrip = {
  content: 5
};

// Act
var answer = rabbitmqHandlers.getDirections(invalidTrip)
var doesntwork = true
answer.then(function (result) {
    doesntwork = false
}, function (err) {
    doesntwork = true
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should reject the message because invalid trip', function () {
    expect(doesntwork).toEqual(true)
  })
})

// Test invalid origin rabbitmq-handlers input
// Arrange

let badOriginInput = {
  origin: "Nicaragua",
  destination: "Miami, Fl",
  departureTime: 12,
  userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
};

let badOriginContent = Object.assign(badOriginInput, {
  toString: () => JSON.stringify(badOriginInput)
});

var badOriginTrip = {
  content: badOriginContent
};

// Act
var answer = rabbitmqHandlers.getDirections(badOriginTrip)
var badorigin = true
answer.then(function (result) {
    badorigin = false
}, function (err) {
    badorigin = true
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should reject the message because invalid origin', function () {
    expect(badorigin).toEqual(true)
  })
})

// Test invalid destination rabbitmq-handlers input
// Arrange

let badDestinationInput = {
  origin: "Weston, Fl",
  destination: "Jerusalem",
  departureTime: 12,
  userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
};

let badDestinationContent = Object.assign(badDestinationInput, {
  toString: () => JSON.stringify(badDestinationInput)
});

var badDestinationTrip = {
  content: badDestinationContent
};

// Act
var answer = rabbitmqHandlers.getDirections(badDestinationTrip)
var badDestination = true
answer.then(function (result) {
  badDestination = false
}, function (err) {
  badDestination = true
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should reject the message because invalid destination', function () {
    expect(badDestination).toEqual(true)
  })
})

// Test invalid departureTime rabbitmq-handlers input
// Arrange

let badDepartureTimeInput = {
  origin: "Weston, Fl",
  destination: "Miami, Fl",
  departureTime: "56",
  userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
};

let badDepartureTimeContent = Object.assign(badDepartureTimeInput, {
  toString: () => JSON.stringify(badDepartureTimeInput)
});

var badDepartureTimeTrip = {
  content: badDepartureTimeContent
};

// Act
var answer = rabbitmqHandlers.getDirections(badDepartureTimeTrip)
var badDepartureTime = true
answer.then(function (result) {
  badDepartureTime = false
}, function (err) {
  badDepartureTime = true
})

// Assert
describe('rabbitmq-handlers', function () {
  it('should reject the message because invalid time', function () {
    expect(badDepartureTime).toEqual(true)
  })
})
