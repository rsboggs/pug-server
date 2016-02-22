var app = require('../server.js');
var expect = require('chai').expect;
var request = require('supertest');
var mongoose = require('mongoose');

var Event = require('../models/eventModel');
var eventController = require('../controllers/eventController');

var clearDB = function (done) {
  mongoose.connection.collections['events'].remove(done);
};

describe('Event Integration Tests', function() {

  beforeEach(function(done) {
    clearDB(function () {
      var events = [
        {
          type: 'soccer',
          location: '19th & Dolores St, San Francisco, CA 94114',
          latitude: 37.759819,
          longitude: -122.426036,
          startTime: new Date('December 17, 2020 03:24:00'),
          endTime: new Date('December 17, 2020 05:24:00'),
          skillLevel: 'Professional'
        },
        {
          type: 'basketball',
          location: '19th & Dolores St, San Francisco, CA 94114',
          latitude: 37.759819,
          longitude: -122.426036,
          startTime: new Date('December 17, 2020 03:24:00'),
          endTime: new Date('December 17, 2020 05:24:00'),
          skillLevel: 'Hobby'
        }
      ];
      Event.create(events, done);
    });
  });

  describe('Event Creation:', function() {

    it('Add Event method creates a new event', function(done) {
      request(app)
      .post('/api/events')
      .send({
        type: 'tennis',
        location: '19th & Dolores St, San Francisco, CA 94114',
        latitude: 37.759819,
        longitude: -122.426036,
        startTime: new Date('December 17, 2020 03:24:00'),
        endTime: new Date('December 17, 2020 05:24:00'),
        skillLevel: 'Hobby'
      })
      .expect(201)
      .end(function(err) {
        if (err) {
          console.error(err);
          done(err);
        } else {
          Event.findOne({'type': 'tennis'})
          .exec(function(err, newEvent) {
            expect(newEvent.type).to.equal('tennis');
            expect(newEvent.location).to.equal('19th & Dolores St, San Francisco, CA 94114');
            expect(newEvent.latitude).to.equal(37.759819);
            expect(newEvent.longitude).to.equal(-122.426036);
            expect(newEvent.startTime).to.exist;
            expect(newEvent.startTime).to.exist;
            expect(newEvent.skillLevel).to.equal('Hobby');
            done();
          });
        }
      });
    });

    it('Get event method gets all events', function(done) {
      request(app)
      .get('/api/events')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          console.error(err);
          done(err);
        } else {
          var resBody = res.body;
          for (var i = 0; i < res.body.length; i++) {
            var testEvent = res.body[i];

            testEvent.hasOwnProperty('type');
            testEvent.hasOwnProperty('location');
            testEvent.hasOwnProperty('latitude');
            testEvent.hasOwnProperty('longitude');
            testEvent.hasOwnProperty('startTime');
            testEvent.hasOwnProperty('endTime');
            testEvent.hasOwnProperty('playerCount');
            testEvent.hasOwnProperty('skillLevel');
          }
          done();
        }
      });
    });
  });
});