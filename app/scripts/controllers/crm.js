'use strict';

angular.module('crmPostgresWebApp')
  .controller('CrmCtrl', ['$scope','Events','$timeout','$http',function ($scope, Events, $timeout, $http) {
    $scope.alertsEvents = [];
    $scope.alertsMain = [];
    $scope.defaultEvent = {subject:'',place:'',date_from:'',date_to:'',time_from:'',time_to:'',description:'',contacts:[]};
    $scope.event = $scope.defaultEvent;
    $scope.eventSource = [];
    $scope.events = [];
    $scope.team = false;
    $scope.contacts = [];
    $scope.searchContact = {};
    $scope.miStep = 15;

    $scope.deleteContact = function(index){
      $scope.contacts.splice(index,1);
    };

    $scope.deleteEvent = function(){
      Events.delete($scope.event,
        function (data) {
          if (data.type == 'success') {
            $('#newEventModal').modal('hide');
            $scope.event = {};
            $scope.alertsMain.push(data);
            $timeout(function () {
              $scope.alertsMain = [];
            }, 10000);
            $scope.initCalendar();
          } else {
            $scope.alertsEvents.push(data);
            $timeout(function () {
              $scope.alertsEvents = [];
            }, 10000);
          }
        },
        function (data) {
          $scope.alertsEvents.push({type: 'danger', msg: 'Při mazání události došlo k chybě.'});
          $timeout(function () {
            $scope.alertsEvents = [];
          }, 10000);
        });
    };

    $scope.setTeam = function(){
      if(!$scope.team){
        Events.setTeam(
          function(data){
            $scope.initCalendarTeam(data);
          },
          function (data) {
            $scope.alertsEvents.push({type: 'danger', msg: 'Při inicializaci kalendáře týmu došlo k chybě.'});
            $timeout(function () {
              $scope.alertsEvents = [];
            }, 10000);
          });
      }else{
        $scope.initCalendar();
      }
    };

    $scope.postEventContact = function(obj){
      Events.post(obj);
    };

    $scope.putEventContact = function(obj){
      Events.put(obj);
    };

    $scope.closeAlertEvent = function(index) {
      $scope.alertsEvents.splice(index, 1);
    };
    $scope.closeAlertMain = function(index) {
      $scope.alertsMain.splice(index, 1);
    };

    $scope.newRecord = function(){
      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      var h = date.getHours();
      var mi = $scope.getMinutes(date.getMinutes());
      var tmp_from = new Date(y, m, d, h, mi);
      var tmp_to = new Date(y, m, d, h, mi + $scope.miStep);
      $scope.event = {
        subject: '',
        place: '',
        date_from: tmp_from,
        date_to: tmp_to,
        time_from: tmp_from,
        time_to: tmp_to,
        description: '',
        contacts: []
      };
    };

    $scope.getMinutes = function(minutes){
      var count = Math.round(60 / $scope.miStep);
      var newMinutes = $scope.miStep * -1;
      for (var i = 0; i < count; i++) {
        newMinutes += $scope.miStep;
        if(newMinutes >= minutes){
          return newMinutes;
        }
      }
      return minutes;
    };

    $scope.getDateTo = function(date){
      return date;
    };

    $scope.getTimeTo = function(date){
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();
      var h = date.getHours();
      var mi = date.getMinutes() + $scope.miStep;
      var newDate = new Date(d,m,y,h,mi);
      return newDate;
    };

    $scope.setTimeTo = function(){
      $scope.event.time_to = $scope.getTimeTo($scope.event.time_from);
    };

    $scope.setDateTo = function(){
      $scope.event.date_to = $scope.event.date_from;
    };

    $scope.postEvents = function(event){
        if (!$scope.event.id) {
          Events.post($scope.event,
            function (data) {
              if (data.type == 'success') {
                $('#newEventModal').modal('hide');
                $scope.event = {};
                $scope.today();
                $scope.alertsMain.push(data);
                $timeout(function () {
                  $scope.alertsMain = [];
                }, 10000);
                $('#EventsModal').modal('hide');
                $scope.initCalendar();
              } else {
                $scope.alertsEvents.push(data);
                $timeout(function () {
                  $scope.alertsEvents = [];
                }, 10000);
              }
            },
            function (data) {
              $scope.alertsEvents.push({type: 'danger', msg: 'Při ukládání události došlo k chybě.'});
              $timeout(function () {
                $scope.alertsEvents = [];
              }, 10000);
            });
        } else {
          Events.put($scope.event,
            function (data) {
              if (data.type == 'success') {
                $('#newEventModal').modal('hide');
                $scope.event = {};
                $scope.today();
                $scope.alertsMain.push(data);
                $timeout(function () {
                  $scope.alertsMain = [];
                }, 10000);
                $('#EventsModal').modal('hide');
                $scope.initCalendar();
              } else {
                $scope.alertsEvents.push(data);
                $timeout(function () {
                  $scope.alertsEvents = [];
                }, 10000);
              }
            },
            function (data) {
              $scope.alertsEvents.push({type: 'danger', msg: 'Při ukládání události došlo k chybě.'});
              $timeout(function () {
                $scope.alertsEvents = [];
              }, 10000);
            });
        }
    }

    $scope.initCalendar = function(){
      Events.list(null,
        function(data){
          $scope.events.splice(0,$scope.events.length);
          $scope.setCalendarData(data);
        },
        function (data) {
          $scope.alertsEvents.push({type: 'danger', msg: 'Při inicializaci kalendáře došlo k chybě.'});
          $timeout(function () {
            $scope.alertsEvents = [];
          }, 10000);
        });
    };

    $scope.initCalendarTeam = function(data){
      $scope.events.splice(0,$scope.events.length);
      $scope.setCalendarData(data);
    };

    $scope.setCalendarData = function(data){
      if(data){
        if(data.rows){
          for (var i = 0; i < data.rows.length; i++) {
            var obj = data.rows[i];
            var date_from = new Date(obj.date_from);
            var date_to = new Date(obj.date_to);
            var contacts = [];
            for (var j = 0; j < data.rows[i].contacts.length; j++) {
              contacts.push({id: data.rows[i].contacts[j].id, name: decodeURIComponent(data.rows[i].contacts[j].name)});
            }
            $scope.events.push({
              id: obj.id,
              subject: decodeURIComponent(obj.name),
              place: decodeURIComponent(obj.place),
              title: decodeURIComponent(obj.name),
              description: decodeURIComponent(obj.description),
              start: date_from,
              end: date_to,
              allDay: false,
              contacts: contacts
            });
          };
        }
      }
    };

    $scope.setEvent = function(event){
      console.log(event);
      $scope.event.id = event.id;
      $scope.event.subject = event.subject;
      $scope.event.place = event.place;
      $scope.event.date_from = event.start;
      $scope.event.time_from = event.start;
      $scope.event.date_to = event.end;
      $scope.event.time_to = event.end;
      $scope.event.description = event.description;
      $scope.event.contacts = event.contacts;
    };

    // RUN
    $scope.initCalendar();

    // TimePicker
    /*$scope.hstep = 1;
    $scope.mstep = 15;
    $scope.ismeridian = false;*/

    //angular.element('timepicker input').addClass( 'input-sm' );

    // DatePicker
/*    $scope.opened = {openedFrom: false,openedTo: false}; */
    $scope.today = function() {
      $scope.event.date_from = new Date();
      $scope.event.date_to = new Date();
      $scope.event.time_from = new Date();
      $scope.event.time_to = new Date();
    };
    $scope.today();

    /*$scope.showWeeks = false;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.event.date_from = null;
      $scope.event.date_to = null;
    };

    // Disable weekend selection
    /*$scope.disabled = function(date, mode) {
     return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
     };*/
/*
    $scope.toggleMin = function() {
      $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function(event, opened) {
      event.preventDefault();
      event.stopPropagation();
      if(event.which != 13) {
        console.log('open '+event.which);
        $scope.opened[opened] = true;
      }
    };

    $scope.dateOptions = {
      "year-format": "'yy'",
      "starting-day": 1,
      "current-text": "Dnes",
      "toggle-weeks-text": "Týdny",
      clearText: "Smazat",
      closeText: "Zavřít"
    };

    $scope.datepickerPopupConfig = {
      'close-text': "Zavřít",
      'clear-text': "Smazat",
      'current-text': "Dnes"
    };

    $scope.formats = ['dd.MM.yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0]; */

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

    /* Event drop */
    $scope.onDrop = function(event,dayDelta,minuteDelta,allDay,revertFunc) {
      console.log(event);
      console.log(dayDelta);
      console.log(minuteDelta);
      console.log(allDay);
      console.log(revertFunc);
      $scope.$apply(function () {
        //$scope.insert = false;
        $scope.setEvent(event);
        $scope.postEvents();
      });
    };

    /* Event resize*/
    $scope.onResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view){
      console.log(event);
      console.log(dayDelta);
      console.log(minuteDelta);
      console.log(jsEvent);
      console.log(ui);
      console.log(view);
      $scope.$apply(function () {
        //$scope.insert = false;
        $scope.setEvent(event);
        $scope.postEvents();
      });
    };

    /* Event click*/
    $scope.onClick = function(event, jsEvent, view){
      //console.log(event);
      //console.log(jsEvent);
      //console.log(view);
      $scope.$apply(function () {
        //$scope.insert = false;
        $scope.setEvent(event);
      });
      //console.log($scope.event.subject);
      $('#currentEvent').click();
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
        eventClick: $scope.onClick,
        eventDrop: $scope.onDrop,
        eventResize: $scope.onResize
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource/*, $scope.eventsF*/];
    //$scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
    //
/*    $scope.$watch('searchContact',function(newVal, oldVal){
      if(oldVal != newVal){
        if($scope.searchContact){
          $scope.addEventContact(newVal);
        }
      }
    }, true);*/

    /*$scope.tmpSearch = null;
    $scope.tmp = null;
    $scope.$watch('tmpSearch',function(newVal, oldVal){
      if(newVal != oldVal){
        if(newVal){
          $scope.addContact(newVal.originalObject);
        }
      }
    }, true);*/
  }]);
