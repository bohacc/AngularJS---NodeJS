'use strict';

angular.module('crmPostgresWebApp')
  .service('Events', ['$http','Tools',function Events($http,Tools) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      delete: function(obj, fce, fceError){
        $http.delete('/api/events/'+obj.id)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      put: function(obj, fce, fceError){
        var date_from = new Date(obj.date_from);
        var time_from = new Date(obj.time_from);
        date_from = new Date(date_from.getFullYear(), date_from.getMonth(), date_from.getDate(), time_from.getHours(), time_from.getMinutes());
        var date_to = new Date(obj.date_to);
        var time_to = new Date(obj.time_to);
        date_to = new Date(date_to.getFullYear(), date_to.getMonth(), date_to.getDate(), time_to.getHours(), time_to.getMinutes());
        if(date_to <= date_from){
          fce({type: 'danger', msg: 'Datum do musí být větší než datum od.'});
          return;
        }
        console.log(date_from);
        console.log(date_to);
        var obj_send = {
          subject: encodeURIComponent(obj.subject),
          place: encodeURIComponent(obj.place),
          date_from: Tools.getDateTimeStr(date_from),
          date_to: Tools.getDateTimeStr(date_to),
          description: encodeURIComponent(obj.description),
          contacts: obj.contacts
        };
        $http.put('/api/events/'+obj.id, obj_send)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      post: function(obj, fce, fceError){
        var date_from = new Date(obj.date_from);
        var time_from = new Date(obj.time_from);
        date_from = new Date(date_from.getFullYear(), date_from.getMonth(), date_from.getDate(), time_from.getHours(), time_from.getMinutes());
        var date_to = new Date(obj.date_to);
        var time_to = new Date(obj.time_to);
        date_to = new Date(date_to.getFullYear(), date_to.getMonth(), date_to.getDate(), time_to.getHours(), time_to.getMinutes());
        if(date_to <= date_from){
          fce({type: 'danger', msg: 'Datum do musí být větší než datum od.'});
          return;
        }
        console.log(date_from);
        console.log(date_to);
        var obj_send = {
          subject: encodeURIComponent(obj.subject),
          place: encodeURIComponent(obj.place),
          date_from: Tools.getDateTimeStr(date_from),
          date_to: Tools.getDateTimeStr(date_to),
          description: encodeURIComponent(obj.description),
          contacts: obj.contacts
        };
        $http.post('/api/events', obj_send)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      list: function(obj, fce, fceError){
        $http.get('/api/events')
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError({type: 'danger', msg: 'Chyba při načítání seznamu událostí.'});
          });
      },
      setTeam: function(callback, callbackError){
        $http.get('/api/events/team')
          .success(function(data){
            callback(data);
          })
          .error(function(data){
            callbackError({type: 'danger', msg: 'Chyba při načítání seznamu událostí týmu.'});
          });
      }
    }
  }]);
