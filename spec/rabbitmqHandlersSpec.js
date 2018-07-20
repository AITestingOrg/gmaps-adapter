const rabbitMqHandlers = require('../src/handlers/rabbitmq-handlers')
// Test valid rabbitmq-handlers input
describe('rabbitmq-handlers', () => {
  it('should have valid content', () => {
    // Arrange
    const validTrip = {
      content: {
        origin: 'Weston, Fl',
        destination: 'Miami, Fl',
        departureTime: 12,
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
      }
    }

    validTrip.content.toString = () => JSON.stringify(validTrip.content)

    // Act
    let answer = rabbitMqHandlers.getDirections(validTrip)
    let resolves = true
    answer.then(() => {
      resolves = true
    }, () => {
      resolves = false
    })
    // Assert
    expect(resolves).toEqual(true)
  })

  // Test invalid rabbitmq-handlers input
  it('should handle invalid input', (done) => {
    // Arrange
    let invalidTrip = {
      content: {
        destination: 'Miami, Fl',
        departureTime: 12,
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
      }
    }

    invalidTrip.content.toString = () => JSON.stringify(invalidTrip.content)

    // Act
    let answer = rabbitMqHandlers.getDirections(invalidTrip)
    let rejects = true
    answer.then(() => {
      done.error()
    }, () => {
      done()
    })
  })

  // Test invalid rabbitmq-handlers input
  it('should handle invalid trip input; doesn\'t conform to model', (done) => {
    // Arrange
    let invalidTrip = {
      content: 5
    }
    // Act
    let answer = rabbitMqHandlers.getDirections(invalidTrip)
    answer.then(function () {
      done.error()
    }, function () {
      done()
    })
  })

  // Test invalid origin rabbitmq-handlers input
  it('should correctly handle invalid origin input', (done) => {
    // Arrange
    const badOriginTrip = {
      content: {
        origin: 'Nicaragua',
        destination: 'Miami, Fl',
        departureTime: 12,
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
      }
    }

    badOriginTrip.content.toString = () => JSON.stringify(badOriginTrip.content)

    // Act
    let answer = rabbitMqHandlers.getDirections(badOriginTrip)
    answer.then(() => {
      done.error()
    }, () => {
      done()
    })
  })
  // Test invalid destination rabbitmq-handlers input
  it('should correctly handle invalid destination', () => {
    // Arrange
    const badDestinationTrip = {
      content: {
        origin: 'Weston, Fl',
        destination: 'Jerusalem',
        departureTime: 12,
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
      }
    }

    badDestinationTrip.content.toString = () => JSON.stringify(badDestinationTrip.content)

    // Act
    let answer = rabbitMqHandlers.getDirections(badDestinationTrip)
    let badDestination = true
    answer.then(() => {
      badDestination = false
    }, () => {
      badDestination = true
    })
    // Assert
    expect(badDestination).toEqual(true)
  })

  // Test invalid departureTime rabbitmq-handlers input
  it('should correctly handle invalid departure time', (done) => {
    // Arrange
    const badDepartureTimeTrip = {
      content: {
        origin: 'Weston, Fl',
        destination: 'Miami, Fl',
        departureTime: '56',
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc',
        toString: () => JSON.stringify(this)
      }
    }
    // Act
    let answer = rabbitMqHandlers.getDirections(badDepartureTimeTrip)
    answer.then(() => {
      done.error()
    }, () => {
      // Assert
      done()
    })
  })
})
