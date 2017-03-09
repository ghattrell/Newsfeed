(function () {
  'use strict';

  describe('Jokes Route Tests', function () {
    // Initialize global variables
    var $scope,
      JokesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _JokesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      JokesService = _JokesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('jokes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/jokes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          JokesController,
          mockJoke;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('jokes.view');
          $templateCache.put('modules/jokes/client/views/view-joke.client.view.html', '');

          // create mock Joke
          mockJoke = new JokesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Joke Name'
          });

          // Initialize Controller
          JokesController = $controller('JokesController as vm', {
            $scope: $scope,
            jokeResolve: mockJoke
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:jokeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.jokeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            jokeId: 1
          })).toEqual('/jokes/1');
        }));

        it('should attach an Joke to the controller scope', function () {
          expect($scope.vm.joke._id).toBe(mockJoke._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/jokes/client/views/view-joke.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          JokesController,
          mockJoke;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('jokes.create');
          $templateCache.put('modules/jokes/client/views/form-joke.client.view.html', '');

          // create mock Joke
          mockJoke = new JokesService();

          // Initialize Controller
          JokesController = $controller('JokesController as vm', {
            $scope: $scope,
            jokeResolve: mockJoke
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.jokeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/jokes/create');
        }));

        it('should attach an Joke to the controller scope', function () {
          expect($scope.vm.joke._id).toBe(mockJoke._id);
          expect($scope.vm.joke._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/jokes/client/views/form-joke.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          JokesController,
          mockJoke;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('jokes.edit');
          $templateCache.put('modules/jokes/client/views/form-joke.client.view.html', '');

          // create mock Joke
          mockJoke = new JokesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Joke Name'
          });

          // Initialize Controller
          JokesController = $controller('JokesController as vm', {
            $scope: $scope,
            jokeResolve: mockJoke
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:jokeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.jokeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            jokeId: 1
          })).toEqual('/jokes/1/edit');
        }));

        it('should attach an Joke to the controller scope', function () {
          expect($scope.vm.joke._id).toBe(mockJoke._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/jokes/client/views/form-joke.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
