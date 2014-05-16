'use strict';

angular.module('crmPostgresWebApp')
  .service('ReservationOffice', ['$http','Tools',function ReservationOffice($http,Tools) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      delete: function(obj, fce, fceError){
        $http.delete('/api/reservation-office/'+obj.id)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      post: function(obj, fce, fceError){
        var date = new Date(obj.date);
        var date_from = new Date(obj.time_from);
        var date_from = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date_from.getHours(), date_from.getMinutes());
        var date_to = new Date(obj.time_to);
        var date_to = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date_to.getHours(), date_to.getMinutes());
        if(date_to <= date_from){
          fce({type: 'danger', msg: 'Datum do musí být větší než datum od.'});
          return;
        }
        var obj_send = {
          room_id: obj.room.id,
          room_name: encodeURIComponent(obj.room.name),
          date_from: Tools.getDateTimeStr(date_from),
          date_to: Tools.getDateTimeStr(date_to)
        };
        $http.post('/api/reservation-office', obj_send)
          .success(function(data){
            fce(data);
          })
          .error(function(data){
            fceError(data);
          });
      },
      list: function(obj, fce){
        if(obj){
          $http.get('/api/rooms/'+obj.id+'/reservation-office')
            .success(function(data){
              fce(data);
            })
            .error(function(data){
              fce({type: 'danger', msg: 'Chyba při načítání seznamu rezervací.'});
            });
        }
      },
      portletsList: function(obj, fce){
        if(obj){
          $http.get('/api/reservation-office/portlets-list')
            .success(function(data){
              fce(data);
            })
            .error(function(data){
              fce({type: 'danger', msg: 'Chyba při načítání seznamu rezervací.'});
            });
        }
      }
    }
  }]);
