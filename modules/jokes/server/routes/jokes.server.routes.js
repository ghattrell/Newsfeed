'use strict';

/**
 * Module dependencies
 */
var jokesPolicy = require('../policies/jokes.server.policy'),
  jokes = require('../controllers/jokes.server.controller'),
  jokesPhoto = require('../controllers/jokes.photo.server.controller');
    

module.exports = function(app) {
  // Jokes Routes
  app.route('/api/jokes').all(jokesPolicy.isAllowed)
    .get(jokes.list)
    .post(jokes.create);

  app.route('/api/jokes/:jokeId').all(jokesPolicy.isAllowed)
    .get(jokes.read)
    .put(jokes.update)
    .delete(jokes.delete);

  app.route('/api/dogs/picture').post(jokesPhoto.uploadJoke);

  // Finish by binding the Joke middleware
  app.param('jokeId', jokes.jokeByID);
};
