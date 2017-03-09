'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Joke Schema
 */
var JokeSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Joke name',
    trim: true
  },
  dateDisplayed: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Joke', JokeSchema);
