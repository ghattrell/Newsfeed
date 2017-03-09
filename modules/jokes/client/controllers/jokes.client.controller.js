(function () {
  'use strict';

  // Jokes controller
  angular
    .module('jokes')
    .controller('JokesController', JokesController);

  JokesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'jokeResolve'];

  function JokesController ($scope, $state, $window, Authentication, joke) {
    var vm = this;

    vm.authentication = Authentication;
    vm.joke = joke;
    vm.isOpen = false;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;

    // Remove existing Joke
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.joke.$remove($state.go('jokes.list'));
      }
    }
  }
}());
