'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Joke = mongoose.model('Joke'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  s3 = require('aws-sdk/clients/s3'),
  multer = require('multer'),
  multerS3 = require('multer-s3');

/**
 * Create a Joke
 */
exports.create = function(req, res) {
  var joke = new Joke(req.body);
  joke.user = req.user;

  joke.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(joke);
    }
  });
};

/**
 * Show the current Joke
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var joke = req.joke ? req.joke.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  joke.isCurrentUserOwner = req.user && joke.user && joke.user._id.toString() === req.user._id.toString();

  res.jsonp(joke);
};

/**
 * Update a Joke
 */
exports.update = function(req, res) {
  var joke = req.joke;

  joke = _.extend(joke, req.body);

  joke.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(joke);
    }
  });
};

/**
 * Delete an Joke
 */
exports.delete = function(req, res) {
  var joke = req.joke;

  joke.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(joke);
    }
  });
};

/**
 * List of Jokes
 */
exports.list = function(req, res) {
  Joke.find().sort('-created').populate('user', 'displayName').exec(function(err, jokes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jokes);
    }
  });
};

/**
 * Joke middleware
 */
exports.jokeByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Joke is invalid'
    });
  }

  Joke.findById(id).populate('user', 'displayName').exec(function (err, joke) {
    if (err) {
      return next(err);
    } else if (!joke) {
      return res.status(404).send({
        message: 'No Joke with that identifier has been found'
      });
    }
    req.joke = joke;
    next();
  });
};

