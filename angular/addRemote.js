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
    $http.get('addRemoteBackend/getRemoteBrands').success(function(data) {
      $scope.files = data;
      console.log(data);
    });

    $scope.brand = "a";
    var data = {
      brand: $scope.brand,
      model: "a",
      custom_name: "ab"
    };

    /*$http.put('/addRemoteBackend/putNewRemote', JSON.stringify(data)).success(function(data) {
      console.log(data);
    });*/

    /*$http.delete('addRemoteBackend/deleteRemote', {params:{custom_name: ""}}).success(function(data) {
      console.log(data);
    });*/

    /*$http.get('editScriptsBackend/getScripts').success(function(data) {
      console.log(data);
    });*/

    var script = {
      "name":"ab",
        "steps": [
          {
            "remote":"e",
            "button":"f",
            "count":"1"
          },
          {
            "remote":"g",
            "button":"h",
            "count":"1"
          }
        ]
    };
    /*$http.put('editScriptsBackend/putNewScript', JSON.stringify(script)).success(function(data) {
      console.log(data);
    });*/

    $http.delete('editScriptsBackend/deleteScript', {params:{custom_name: "ab"}}).success(function(data) {
      console.log(data);
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
