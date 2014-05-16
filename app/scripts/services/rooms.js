'use strict';

angular.module('crmPostgresWebApp')
  .service('Rooms', ['$http',function Rooms($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      post: function(obj, fce, fceError){
        $http.post('/api/rooms',{name: encodeURIComponent(obj.name)})
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      delete: function(obj, fce, fceError){
        $http.delete('/api/rooms/'+obj.id)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      list: function(fce){
        $http.get('/api/rooms')
          .success(function(data){
            fce(data);
          });
      }
    }
  }]);
