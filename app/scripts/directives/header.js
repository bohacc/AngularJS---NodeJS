'use strict';

angular.module('crmPostgresWebApp')
  .directive('header', function () {
    return {
      templateUrl: 'views/d_header.html',
      restrict: 'E',
      controller: ['$scope','$http','$location','AuthenticationService',function($scope, $http, $location, auth){
        $scope.modules = [{name: 'Rezervace místností', redirect: '/rezervace-mistnosti'}];
        $scope.logout = auth.logout;
        $scope.header_title = '';
        $scope.loadMenu = function(){
          $http.post('/menu').
            success(function(data){
              if(data.isLogin){
                $scope.header_title = decodeURIComponent(data.title);
              }else{
                $location.path('/login');
              }
            });
        };
        $scope.loadMenu();
      }]
    };
  });
