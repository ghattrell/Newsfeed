// Jokes service used to communicate Jokes REST endpoints
(function () {
  'use strict';

  angular
    .module('jokes')
    .factory('JokesService', JokesService);

  JokesService.$inject = ['$resource'];

  function JokesService($resource) {
    return $resource('api/jokes/:jokeId', {
      jokeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
