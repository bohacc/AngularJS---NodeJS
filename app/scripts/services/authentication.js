'use strict';

angular.module('crmPostgresWebApp')
  .service('AuthenticationService', ['$location','$http', function($location,$http){
    var isLogin = false;
    return {
      isLogin: isLogin,
      login: function(credentials, fce, fceErrorAuth, fceError){
        $http.post('/signin', credentials).
          success(function(data){
            if(data.login){
              isLogin = true;
              fce(data);
            }else{
              fceErrorAuth(data);
            }
          })
          .error(function(data){
            fceError(data);
          });
      },
      logout: function(){
        $http.post('/logout').
          success(function(){
            $location.path('/login');
          });
      }
    };
  }]);
