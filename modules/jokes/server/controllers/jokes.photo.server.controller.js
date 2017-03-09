'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  Joke = mongoose.model('Joke'),
    AWS = require('aws-sdk'),
    multerS3 = require('multer-s3');

/**
 * Update profile picture
 */
exports.uploadJoke = function (req, res) {
    var s3 = new AWS.S3();
    var upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'pluto-dev-newsfeed-raffler',
            key: function (req, file, cb) {
                cb(null, '/jokes/' + Date.now().toString())
            }
        })
    }).single('newJokePicture');

    upload(req, res, function (uploadError) {
        if(uploadError) {
            return res.status(400).send({
                message: 'Error occurred while uploading profile picture'
            });
        } else {
            return res.status(200).send({
                message: 'Your photo was successfully uploaded'
            })
        }
    });
};

