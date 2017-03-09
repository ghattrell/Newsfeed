(function () {
  'use strict';

  angular
    .module('jokes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('jokes', {
        abstract: true,
        url: '/jokes',
        template: '<ui-view/>'
      })
      .state('jokes.list', {
        url: '',
        templateUrl: 'modules/jokes/client/views/list-jokes.client.view.html',
        controller: 'JokesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Jokes List'
        }
      })
      .state('jokes.create', {
        url: '/create',
        templateUrl: 'modules/jokes/client/views/form-joke.client.view.html',
        controller: 'JokesCreateController',
        controllerAs: 'vm',
        resolve: {
          jokeResolve: newJoke
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Jokes Create'
        }
      })
      .state('jokes.edit', {
        url: '/:jokeId/edit',
        templateUrl: 'modules/jokes/client/views/form-joke.client.view.html',
        controller: 'JokesController',
        controllerAs: 'vm',
        resolve: {
          jokeResolve: getJoke
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Joke {{ jokeResolve.name }}'
        }
      })
      .state('jokes.view', {
        url: '/:jokeId',
        templateUrl: 'modules/jokes/client/views/view-joke.client.view.html',
        controller: 'JokesController',
        controllerAs: 'vm',
        resolve: {
          jokeResolve: getJoke
        },
        data: {
          pageTitle: 'Joke {{ jokeResolve.name }}'
        }
      });
  }

  getJoke.$inject = ['$stateParams', 'JokesService'];

  function getJoke($stateParams, JokesService) {
    return JokesService.get({
      jokeId: $stateParams.jokeId
    }).$promise;
  }

  newJoke.$inject = ['JokesService'];

  function newJoke(JokesService) {
    return new JokesService();
  }
}());
