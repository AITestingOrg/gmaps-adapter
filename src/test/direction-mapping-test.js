process.env.NODE_ENV = 'test';
// const responseJson = require('../../data/sampleResponse.json')
const assert = require('assert');
// const sinon = require('sinon');
const delay = require('delay');
const expect = require('chai').expect;
const mock = require('mock-require');
const MockRes = require('mock-res');
const res = new MockRes();
const responseParser = (any) => {
    const result = {
        duration: 2236,
        distance: 37377
    };
    res.statusCode = 200;
    res._getJSON = result;
    return result;
};
const errorParser = (any) => {
    const result = {err: 'error'};
    res.statusCode = 400;
    res._getJSON = result;
    return result;
};
mock('./../utils/parser.js', {responseParser:responseParser, errorParser:errorParser});
const mapping = require('../routes/direction-mapping.js');

describe('directions-mapping', () => {

    it('should respond with the parsed data', () => {
        const req = { body: {
            "origin": "weston, fl",
	        "destination": "Miami lakes, fl",
            "departure_time": 1521760200
            }
        };

        mapping(req, () => { });

        expect(res.statusCode).equal(200);
        expect(res._getJSON.toString).equal(responseParser.toString);
   });

   it('should error', () => {
        const req = { body: {
            "origin": "some invalid origin",
            "destination": "Miami lakes, fl",
            "departure_time": 1521760200
            }
        };
        mapping(req, () => { });

        delay(200).then( () => {
            expect(res.statusCode).equal(400);
            expect(res._getJSON.toString).equal('error');
        })
   })
});

mock.stopAll;