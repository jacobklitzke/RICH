angular.module('addRemote', [])
  .controller('addRemoteCtrl', function($scope, $http) {
    $http.get('addRemoteBackend').success(function(data) {
      console.log(data);
    });
    $scope.names = ["Emil", "Tobias", "Linus"];
  })
  .directive('remoteSelect', function () {
    return {
      template: "<h1>Made by a directive!</h1>"
    };
  });
