'use strict';

angular.module('crmPostgresWebApp')
  .controller('LoginController', ['$scope','AuthenticationService','$http','$timeout','$location', function($scope, auth, $http, $timeout, $location){
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.credentials = {company: '', username:'', password:''};

    $scope.login = function(){
      $scope.alerts = [];
      auth.login($scope.credentials,
        function(){
          $location.path('/crm');
        },
        function(data){
          $scope.alerts = [];
          $scope.alerts.push({type: 'danger', msg: data.message});
          $timeout(function(){
            $scope.alerts = [];
          }, 10000);
        },
        function(data){
          $scope.alerts = [];
          $scope.alerts.push({type: 'danger', msg: data.message});
          $timeout(function(){
            $scope.alerts = [];
          }, 10000);
        });
    };

    /*$http.post('/test')
      .success(function(data){
        console.log(data);
      });*/
  }]);
