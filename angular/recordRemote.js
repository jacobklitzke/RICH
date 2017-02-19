angular.module('recordRemote', [])
  .controller('recordRemoteCtrl', function($scope, $http, $timeout) {
    $http.get('recordRemoteBackend/startRecording').success(function(data) {
      $scope.output = data;
      console.log(data);
    });
    $scope.test = "hello";
    var loadTime = 1000; //Load the data every second
    var errorCount = 0; //Counter for the server errors
    var loadPromise; //Pointer to the promise created by the Angular $timout service

    var getData = function() {
       $http.get('recordRemoteBackend/getRecordOutput')
       .success(function(data) {
            console.log(data);
            $scope.output = data;
             errorCount = 0;
             nextLoad();
       })

       .catch(function(res) {
            $scope.data = 'Server error';
            nextLoad(++errorCount * 2 * loadTime);
       });
     };

    var cancelNextLoad = function() {
        $timeout.cancel(loadPromise);
    };

   var nextLoad = function(mill) {
       mill = mill || loadTime;
       //Always make sure the last timeout is cleared before starting a new one
       cancelNextLoad();
       $timeout(getData, mill);
   };
   getData();

   $scope.writeData = function() {
     var button = "";
     $http.post('recordRemoteBackend/postRecordData', button).success(function(data) {
       console.log(data);
     });
   };
    //Always clear the timeout when the view is destroyed, otherwise it will   keep polling
    $scope.$on('$destroy', function() {
      http.get('recordRemoteBackend/quitIRRecord').success(function(data) {
        console.log(data);
      });
      cancelNextLoad();
    });
  });
