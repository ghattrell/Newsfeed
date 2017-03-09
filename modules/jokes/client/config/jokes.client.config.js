'use strict';

// Configuring the jokes module
angular.module('jokes').run(['Menus',
  function (Menus) {
    // Add the jokes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Jokes',
      state: 'jokes',
      type: 'dropdown',
      roles: ['admin']
      
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'jokes', {
      title: 'List Jokes',
      state: 'jokes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'jokes', {
      title: 'Create Jokes',
      state: 'jokes.create',
      roles: ['admin']
    });
  }
]);
