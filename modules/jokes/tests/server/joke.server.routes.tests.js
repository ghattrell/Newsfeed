'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Joke = mongoose.model('Joke'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  joke;

/**
 * Joke routes tests
 */
describe('Joke CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Joke
    user.save(function () {
      joke = {
        name: 'Joke name'
      };

      done();
    });
  });

  it('should be able to save a Joke if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Joke
        agent.post('/api/jokes')
          .send(joke)
          .expect(200)
          .end(function (jokeSaveErr, jokeSaveRes) {
            // Handle Joke save error
            if (jokeSaveErr) {
              return done(jokeSaveErr);
            }

            // Get a list of Jokes
            agent.get('/api/jokes')
              .end(function (jokesGetErr, jokesGetRes) {
                // Handle Jokes save error
                if (jokesGetErr) {
                  return done(jokesGetErr);
                }

                // Get Jokes list
                var jokes = jokesGetRes.body;

                // Set assertions
                (jokes[0].user._id).should.equal(userId);
                (jokes[0].name).should.match('Joke name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Joke if not logged in', function (done) {
    agent.post('/api/jokes')
      .send(joke)
      .expect(403)
      .end(function (jokeSaveErr, jokeSaveRes) {
        // Call the assertion callback
        done(jokeSaveErr);
      });
  });

  it('should not be able to save an Joke if no name is provided', function (done) {
    // Invalidate name field
    joke.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Joke
        agent.post('/api/jokes')
          .send(joke)
          .expect(400)
          .end(function (jokeSaveErr, jokeSaveRes) {
            // Set message assertion
            (jokeSaveRes.body.message).should.match('Please fill Joke name');

            // Handle Joke save error
            done(jokeSaveErr);
          });
      });
  });

  it('should be able to update an Joke if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Joke
        agent.post('/api/jokes')
          .send(joke)
          .expect(200)
          .end(function (jokeSaveErr, jokeSaveRes) {
            // Handle Joke save error
            if (jokeSaveErr) {
              return done(jokeSaveErr);
            }

            // Update Joke name
            joke.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Joke
            agent.put('/api/jokes/' + jokeSaveRes.body._id)
              .send(joke)
              .expect(200)
              .end(function (jokeUpdateErr, jokeUpdateRes) {
                // Handle Joke update error
                if (jokeUpdateErr) {
                  return done(jokeUpdateErr);
                }

                // Set assertions
                (jokeUpdateRes.body._id).should.equal(jokeSaveRes.body._id);
                (jokeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Jokes if not signed in', function (done) {
    // Create new Joke model instance
    var jokeObj = new Joke(joke);

    // Save the joke
    jokeObj.save(function () {
      // Request Jokes
      request(app).get('/api/jokes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Joke if not signed in', function (done) {
    // Create new Joke model instance
    var jokeObj = new Joke(joke);

    // Save the Joke
    jokeObj.save(function () {
      request(app).get('/api/jokes/' + jokeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', joke.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Joke with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/jokes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Joke is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Joke which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Joke
    request(app).get('/api/jokes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Joke with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Joke if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Joke
        agent.post('/api/jokes')
          .send(joke)
          .expect(200)
          .end(function (jokeSaveErr, jokeSaveRes) {
            // Handle Joke save error
            if (jokeSaveErr) {
              return done(jokeSaveErr);
            }

            // Delete an existing Joke
            agent.delete('/api/jokes/' + jokeSaveRes.body._id)
              .send(joke)
              .expect(200)
              .end(function (jokeDeleteErr, jokeDeleteRes) {
                // Handle joke error error
                if (jokeDeleteErr) {
                  return done(jokeDeleteErr);
                }

                // Set assertions
                (jokeDeleteRes.body._id).should.equal(jokeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Joke if not signed in', function (done) {
    // Set Joke user
    joke.user = user;

    // Create new Joke model instance
    var jokeObj = new Joke(joke);

    // Save the Joke
    jokeObj.save(function () {
      // Try deleting Joke
      request(app).delete('/api/jokes/' + jokeObj._id)
        .expect(403)
        .end(function (jokeDeleteErr, jokeDeleteRes) {
          // Set message assertion
          (jokeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Joke error error
          done(jokeDeleteErr);
        });

    });
  });

  it('should be able to get a single Joke that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Joke
          agent.post('/api/jokes')
            .send(joke)
            .expect(200)
            .end(function (jokeSaveErr, jokeSaveRes) {
              // Handle Joke save error
              if (jokeSaveErr) {
                return done(jokeSaveErr);
              }

              // Set assertions on new Joke
              (jokeSaveRes.body.name).should.equal(joke.name);
              should.exist(jokeSaveRes.body.user);
              should.equal(jokeSaveRes.body.user._id, orphanId);

              // force the Joke to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Joke
                    agent.get('/api/jokes/' + jokeSaveRes.body._id)
                      .expect(200)
                      .end(function (jokeInfoErr, jokeInfoRes) {
                        // Handle Joke error
                        if (jokeInfoErr) {
                          return done(jokeInfoErr);
                        }

                        // Set assertions
                        (jokeInfoRes.body._id).should.equal(jokeSaveRes.body._id);
                        (jokeInfoRes.body.name).should.equal(joke.name);
                        should.equal(jokeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Joke.remove().exec(done);
    });
  });
});
