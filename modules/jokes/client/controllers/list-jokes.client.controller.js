(function () {
  'use strict';

  angular
    .module('jokes')
    .controller('JokesListController', JokesListController);

  JokesListController.$inject = ['JokesService'];

  function JokesListController(JokesService) {
    var vm = this;

    vm.jokes = JokesService.query();
  }
}());
