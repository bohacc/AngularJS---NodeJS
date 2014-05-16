'use strict';

angular.module('crmPostgresWebApp')
  .controller('ReservationOfficeCtrl', ['$scope','ReservationOffice','Rooms','$timeout',function ($scope, ReservationOffice, Rooms, $timeout) {
    $scope.rooms = [];
    $scope.new_room = '';
    $scope.room = {};
    $scope.alertsReservation = [];
    $scope.alertsRoom = [];
    $scope.alertsMain = [];
    $scope.reservationOffice = {room: ''};
    $scope.eventSource = [];
    $scope.events = [];

    $scope.closeAlertReservation = function(index) {
      $scope.alertsReservation.splice(index, 1);
    };
    $scope.closeAlertRoom = function(index) {
      $scope.alertsRoom.splice(index, 1);
    };
    $scope.closeAlertMain = function(index) {
      $scope.alertsMain.splice(index, 1);
    };

    $scope.postReservationOffice = function(){
      ReservationOffice.post($scope.reservationOffice,
        function(data){
          if(data.type == 'success'){
            $scope.alertsMain.push(data);
            $timeout(function(){
              $scope.alertsMain = [];
            }, 10000);
            $('#reservationOfficeModal').modal('hide');
            $scope.initCalendar();
          }else{
            $scope.alertsReservation.push(data);
            $timeout(function(){
              $scope.alertsReservation = [];
            }, 10000);
          }
        },
        function(data){
          $scope.alertsReservation.push({type: 'danger', msg: 'Při ukládání rezervace došlo k chybě.'});
          $timeout(function(){
            $scope.alertsReservation = [];
          }, 10000);
        });
    }

    $scope.postRoom = function(){
      Rooms.post({
          name: $scope.new_room
        },
        function(data){
          if(data.type == 'success'){
            $('#newRoomModal').modal('hide');
            $scope.new_room = '';
            $scope.initRooms();
            $scope.alertsMain.push(data);
            $timeout(function(){
              $scope.alertsMain = [];
            }, 10000);
          }else{
            $scope.alertsRoom.push(data);
            $timeout(function(){
              $scope.alertsRoom = [];
            }, 10000);
          }
        },
        function(){
          $scope.alertsRoom.push({type: 'danger', msg: 'Při ukládání místnosti došlo k chybě.'});
          $timeout(function(){
            $scope.alertsRoom = [];
          }, 10000);
        });
    };

    $scope.deleteRoom = function(){
      Rooms.delete({id: $scope.room.id},
        function(data){
          if(data.type == 'success'){
            $scope.alertsMain.push(data);
            $timeout(function(){
              $scope.alertsMain = [];
            }, 10000);
            $scope.initRooms();
          }else{
            $scope.alertsMain.push(data);
            $timeout(function(){
              $scope.alertsMain = [];
            }, 10000);
          }
        },
        function(data){
          $scope.alertsMain.push({type: 'danger', msg: 'Při mazání místnosti došlo k chybě.'});
          $timeout(function(){
            $scope.alertsMain = [];
          }, 10000);
        });
    }


    $scope.initCalendar = function(){
      ReservationOffice.list({id: $scope.room.id}, function(data){
        $scope.events.splice(0,$scope.events.length);
        if(data){
          for (var i = 0; i < data.rows.length; i++) {
            var obj = data.rows[i];
            var date_from = new Date(obj.date_from);
            var date_to = new Date(obj.date_to);
            $scope.events.push({
              title: decodeURIComponent(obj.name),
              start: date_from,
              end: date_to,
              allDay: false
            });
          };
          //$scope.calendar.fullCalendar('render');
        }
      });
    };

    $scope.initRooms = function(){
      Rooms.list(function(data){
        $scope.rooms = [];
        if(data){
          for (var i = 0; i < data.rows.length; i++) {
            var obj = data.rows[i];
            $scope.rooms.push({id: data.rows[i].id, name: decodeURIComponent(data.rows[i].name)});
          }
        }
        $scope.room = $scope.rooms[0];
        $scope.initCalendar();
      });
    }

    // Run
    $scope.initRooms();

    // TimePicker
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.reservationOffice.time_from = new Date();
    $scope.reservationOffice.time_to = new Date();
    $scope.ismeridian = false;

    // DatePicker
    $scope.today = function() {
      $scope.reservationOffice.date = new Date();
    };
    $scope.today();

    $scope.showWeeks = false;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.reservationOffice.date = null;
    };

    // Disable weekend selection
    /*$scope.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };*/

    $scope.toggleMin = function() {
      $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      "year-format": "'yy'",
      "starting-day": 1,
      "current-text": "Dnes",
      "toggle-weeks-text": "Týdny",
      "clear-text": "Smazat",
      "close-text": "Zavřít"
    };

    $scope.formats = ['dd.MM.yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];

    // Calendar
    /* config object */
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var h = date.getHours();
    var mi = date.getMinutes();

    /* event source that calls a function on every view switch */
    /*$scope.eventsF = function (start, end, callback) {
      var s = new Date(start).getTime() / 1000;
      var e = new Date(end).getTime() / 1000;
      var m = new Date(start).getMonth();
      var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
      callback(events);
    };*/

    /*$scope.calEventsExt = {
      color: '#f00',
      textColor: 'yellow',
      events: [
        {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
        {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
        {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
      ]
    };*/

    /* alert on eventClick */
    $scope.alertEventOnClick = function( date, allDay, jsEvent, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Day Clicked ' + date);
      });
    };

    /* alert on Drop */
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + dayDelta);
      });
    };

    /* alert on Resize */
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
      $scope.$apply(function(){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + minuteDelta);
      });
    };

    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Nová událost',
        start: new Date(y, m, d, h, mi),
        end: new Date(y, m, d, h, mi),
        className: ['openSesame'],
        allDay: false
      });
    };

    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
      calendar.fullCalendar('changeView',view);
    };

    /* Change View */
    $scope.renderCalender = function(calendar) {
      calendar.fullCalendar('render');
    };

    //$scope.firstDay = 1;
    /* config object */
    $scope.uiConfig = {
      calendar:{
        firstDay: 1,
        axisFormat: 'H(:mm)',
        timeFormat: 'H(:mm)',
        allDayText: 'Celý den',
        columnFormat: {
          month: 'ddd',    // Mon
          week: 'ddd d/M', // Mon 9/7
          day: 'dddd d/M'  // Monday 9/7
        },
        titleFormat: {
          month: 'MMMM yyyy',                             // September 2009
          week: "d [MMMM] [ yyyy]{ '&#8212;'d MMMM yyyy}", // Sep 7 - 13 2009
          day: 'dddd, d MMMM, yyyy'                  // Tuesday, Sep 8, 2009
        },
        buttonText: {
          today:    'Dnes',
          month:    'Měsíc',
          week:     'Týden',
          day:      'Den'
        },
        height: 550,
        editable: true,
        header:{
          left: 'agendaDay agendaWeek month',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource/*, $scope.eventsF*/];
    //$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
  }]);
