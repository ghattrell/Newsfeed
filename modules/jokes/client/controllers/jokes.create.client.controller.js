(function () {
  'use strict';

  // Jokes controller
  angular
    .module('jokes')
    .controller('JokesCreateController', JokesCreateController);

  JokesCreateController.$inject = ['$scope', '$state', '$window', '$timeout', 'Authentication', 'jokeResolve', 'FileUploader'];

  function JokesCreateController ($scope, $state, $window, $timeout, Authentication, joke, FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.joke = joke;
    vm.isOpen = false;
    vm.error = null;
    vm.form = {};
    vm.save = save;

    $scope.imageURL = '/modules/users/client/img/profile/default.png';

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/dogs/picture',
      alias: 'newJokePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Upload that joke image
    $scope.uploadJoke = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
    };

    // Save Joke
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.jokeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.joke._id) {
        vm.joke.$update(successCallback, errorCallback);
      } else {
        vm.joke.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('jokes.view', {
          jokeId: res._id
        });


      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
