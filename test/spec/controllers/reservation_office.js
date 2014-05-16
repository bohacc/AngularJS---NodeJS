'use strict';

describe('Controller: ReservationOfficeCtrl', function () {

  // load the controller's module
  beforeEach(module('crmPostgresWebApp'));

  var ReservationOfficeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReservationOfficeCtrl = $controller('ReservationOfficeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
