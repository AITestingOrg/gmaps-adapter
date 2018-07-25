const rabbitMqHandlers = require('../src/handlers/rabbitmq-handlers')
describe('rabbitmq-handlers', () => {
  it('should have valid content', (done) => {
    // Arrange
    const validTrip = {
      content: {
        origin: 'Weston, Fl',
        destination: 'Miami, Fl',
        departureTime: 'now',
        userID: '560c62f4-8612-11e8-adc0-fa7ae01bbebc'
      }
    }
    validTrip.content.toString = () => JSON.stringify(validTrip.content)

    // Act
    rabbitMqHandlers.getDirections(validTrip).then(() => {
      done()
    }, () => {
      done(new Error('did not correctly respond to a body with an invalid dest time'))
    })
  }, 5000)

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
    answer.then(() => {
      done(new Error('Promise should have been rejected'))
    }, () => {
      done()
    })
  })

  it('should handle invalid trip input; doesn\'t conform to model', (done) => {
    // Arrange
    let invalidTrip = {
      content: 5
    }
    // Act
    let answer = rabbitMqHandlers.getDirections(invalidTrip)
    answer.then(function () {
      done(new Error('accepted an input with an invalid body'))
    }, function () {
      done()
    })
  })

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
      done(new Error('input with an invalid origin was accepted'))
    }, () => {
      done()
    })
  })

  it('should correctly handle invalid destination', (done) => {
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

    answer.then(() => {
      done(new Error('input with an invalid destination was accepted'))
    }, () => {
      done()
    })
  })

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
      done(new Error('input with an invalid departure time was accepted'))
    }, () => {
      // Assert
      done()
    })
  })
})
