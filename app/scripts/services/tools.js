'use strict';

angular.module('crmPostgresWebApp')
  .service('Tools', function Tools() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {
      getDateTimeStr: function(date){
        var str = '';
        if(date){
          var d = date.getDate();
          var m = date.getMonth()+1;
          var y = date.getFullYear();
          var h = date.getHours();
          var mi = date.getMinutes();
          console.log(date);
          console.log(d+'.'+m+'.'+y+' '+h+':'+mi);
          return d+'.'+m+'.'+y+' '+h+':'+mi;
        }
        return str;
      }
    }
  });
