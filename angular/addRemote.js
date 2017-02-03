angular.module('addRemote', ["ngRoute"])
  .config(function($routeProvider) {
    $routeProvider
    .when("/", {
      templateUrl : "partials/main.htm",
      controller : "mainCtrl"
    })
    .when("/recordRemote", {
      templateUrl:  "partials/recordRemote.htm",
      controller:   "recordRemoteCtrl"
    });
  })
  .controller('addRemoteCtrl', function($scope, $http) {
  })
  .controller('mainCtrl', function ($scope, $http, $location) {
    $http.get('addRemoteBackend/getFiles').success(function(data) {
      $scope.files = data;
    });

    $scope.go = function(path) {
      $location.path(path);
    };
  })
  .controller('recordRemoteCtrl', function ($scope, $http, $location) {
    $scope.buttonStep = 0;
    $scope.fromBackend = 'Initial Data';
    var counter = 0;
    $scope.selectedValue='';
    $scope.dropDown = [
      {option:'something a',value:'a value'},
      {option:'something b',value:'b value'},
      {option:'something c',value:'c value'},
      {option:'something d',value:'d value'},
    ];

    $scope.buttonState = [
      {step:0, state:"Begin"},
      {step:1, state:"Press Enter"},
      {step:2, state:"Press Enter after selecting"},
      {step:3, state:"Finished"}
    ];

    $scope.updateHtml = function() {
      if ($scope.buttonStep < $scope.buttonState.length -1) {
        $scope.buttonStep++;
        collectBackend();
      }
    };

    function collectBackend() {
      $http.get('addRemoteBackend',{params:{selected:$scope.selectedValue}}).success(function(data) {
        $scope.fromBackend = data + counter;
        counter++;
      });
    }
  })
  .directive('remoteSelect', function () {
    return {
      template: "<h1>Made by a directive!</h1>"
    };
  });
