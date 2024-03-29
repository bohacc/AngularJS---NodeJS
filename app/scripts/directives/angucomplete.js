/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('angucomplete', [] )
  .directive('angucomplete', function ($parse, $http, $sce) {
    return {
      restrict: 'EA',
      scope: {
        "id": "@id",
        "placeholder": "@placeholder",
        "selectedObject": "=selectedobject",
        "url": "@url",
        "dataField": "@datafield",
        "titleField": "@titlefield",
        "descriptionField": "@descriptionfield",
        "imageField": "@imagefield",
        "inputClass": "@inputclass",
        "userPause": "@pause",
        "localData": "=localdata",
        "searchFields": "@searchfields",
        "minLengthUser": "@minlength",
        "matchClass": "@matchclass",
        boxItems: "=items",
        boxClass: "=boxClass"
      },
      template: '<div class=\"mac-tag-autocomplete\" style="width: 95%">' +
        '<ul class=\"tag-list\" style="float: left">' +
        '  <li ng-repeat=\"item in boxItems\" class=\"tag label\">' +
        '    <div ng-click=\"onDelete($index)\" class=\"tag-close\">&times;</div>' +
        '    <span class=\"tag-label\">{{item.name}}</span>' +
        '  </li>' +
        '</ul>' +
        '<span class="angucomplete-holder" style="float: left">' +
        '  <input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" style="border: 0px;" ng-keyup="keyPressed($event)"/>' +
        '  <div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown">' +
        '    <div class="angucomplete-searching" ng-show="searching">Searching...</div>' +
        '    <div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div>' +
        '    <div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}">' +
        '      <div ng-if="imageField" class="angucomplete-image-holder">' +
        '        <img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/>' +
        '        <div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div>' +
        '      </div>' +
        '      <div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div>' +
        '      <div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div>' +
        '      <div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div>' +
        '    </div>' +
        '  </div>' +
        '</span>' +
        '</div>',
      controller: function ( $scope ) {
        $scope.lastSearchTerm = null;
        $scope.currentIndex = null;
        $scope.justChanged = false;
        $scope.searchTimer = null;
        $scope.searching = false;
        $scope.pause = 500;
        $scope.minLength = 3;

        if ($scope.minLengthUser && $scope.minLengthUser != "") {
          $scope.minLength = $scope.minLengthUser;
        }

        if ($scope.userPause) {
          $scope.pause = $scope.userPause;
        }

        extractValue = function(obj, key) {
          if (key) {
            value = eval("obj." + key);
          } else {
            value = obj;
          }
          return value;
        }

        isNewSearchNeeded = function(newTerm, oldTerm) {
          return newTerm.length >= $scope.minLength && newTerm != oldTerm
        }

        $scope.processResults = function(responseData, str) {
          if (responseData && responseData.length > 0) {
            $scope.results = [];

            var titleFields = [];
            if ($scope.titleField && $scope.titleField != "") {
              titleFields = $scope.titleField.split(",");
            }

            for (var i = 0; i < responseData.length; i++) {
              // Get title variables
              var titleCode = "";

              for (var t = 0; t < titleFields.length; t++) {
                if (t > 0) {
                  titleCode = titleCode +  " + ' ' + ";
                }
                titleCode = titleCode + "responseData[i]." + titleFields[t];
              }

              var description = "";
              if ($scope.descriptionField) {
                description = extractValue(responseData[i], $scope.descriptionField);
              }

              var image = "";
              if ($scope.imageField) {
                image = extractValue(responseData[i], $scope.imageField);
              }

              var text = eval(titleCode);
              if ($scope.matchClass) {
                var re = new RegExp(str, 'i');
                var strPart = text.match(re)[0];
                text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
              }

              var resultRow = {
                title: text,
                description: description,
                image: image,
                originalObject: responseData[i]
              }

              $scope.results[$scope.results.length] = resultRow;
            }


          } else {
            $scope.results = [];
          }
        }

        $scope.searchTimerComplete = function(str) {
          // Begin the search

          if (str.length >= $scope.minLength) {
            if ($scope.localData) {
              var searchFields = $scope.searchFields.split(",");

              var matches = [];

              for (var i = 0; i < $scope.localData.length; i++) {
                var match = false;

                for (var s = 0; s < searchFields.length; s++) {
                  var evalStr = 'match = match || ($scope.localData[i].' + searchFields[s] + '.toLowerCase().indexOf("' + str.toLowerCase() + '") >= 0)';
                  eval(evalStr);
                }

                if (match) {
                  matches[matches.length] = $scope.localData[i];
                }
              }

              $scope.searching = false;
              $scope.processResults(matches, str);
              $scope.$apply();


            } else {
              $http.get($scope.url + str, {}).
                success(function(responseData, status, headers, config) {
                  $scope.searching = false;
                  data = extractValue(responseData, $scope.dataField)
                  $scope.processResults(data, str);
                }).
                error(function(data, status, headers, config) {
                  console.log("error");
                });
            }
          }

        }

        $scope.hoverRow = function(index) {
          $scope.currentIndex = index;
        }

        $scope.keyPressed = function(event) {
          if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
            if (!$scope.searchStr || $scope.searchStr == "") {
              $scope.showDropdown = false;
              $scope.lastSearchTerm = null
            } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
              $scope.lastSearchTerm = $scope.searchStr
              $scope.showDropdown = true;
              $scope.currentIndex = -1;
              $scope.results = [];

              if ($scope.searchTimer) {
                clearTimeout($scope.searchTimer);
              }

              $scope.searching = true;

              $scope.searchTimer = setTimeout(function() {
                $scope.searchTimerComplete($scope.searchStr);
              }, $scope.pause);
            }
          } else {
            event.preventDefault();
          }
        }

        $scope.selectResult = function(result) {
          if ($scope.matchClass) {
            result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
          }
          $scope.searchStr = $scope.lastSearchTerm = result.title;
          $scope.selectedObject = result;
          $scope.showDropdown = false;
          $scope.results = [];
          //$scope.$apply();

          // MB
          $scope.searchStr = '';
          //$scope.boxItems.push(result.originalObject);
        }

        // MB
        $scope.addItem = function(obj){
          var exist = false;
          if(obj) {
            for (var i = 0; i < $scope.boxItems.length; i++) {
              var item = $scope.boxItems[i];
              if(item.id == obj.id){
                exist = true;
              }
            }
            if(!exist) {
              $scope.boxItems.push(obj);
            }
          }
        };

        // MB
        $scope.$watch('selectedObject',function(newVal, oldVal){
          if(newVal != oldVal){
            if(newVal){
              $scope.addItem(newVal.originalObject);
              $scope.selectedObject = {};
            }
          }
        }, true);

        // MB
        $scope.onDelete = function(index){
          $scope.boxItems.splice(index,1);
        }
      },

      link: function($scope, elem, attrs, ctrl) {

        elem.bind("keyup", function (event) {
          if(event.which === 40) {
            if (($scope.currentIndex + 1) < $scope.results.length) {
              $scope.currentIndex ++;
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }

            $scope.$apply();
          } else if(event.which == 38) {
            if ($scope.currentIndex >= 1) {
              $scope.currentIndex --;
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }

          } else if (event.which == 13) {
            if ($scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
              $scope.selectResult($scope.results[$scope.currentIndex]);
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            } else {
              $scope.results = [];
              $scope.$apply();
              event.preventDefault;
              event.stopPropagation();
            }

          } else if (event.which == 27) {
            $scope.results = [];
            $scope.showDropdown = false;
            $scope.$apply();
          } else if (event.which == 8) {
            $scope.selectedObject = null;
            $scope.$apply();
          }
        });


      }
    };
  });

