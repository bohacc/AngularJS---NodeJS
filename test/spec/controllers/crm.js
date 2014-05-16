'use strict';

describe('Controller: CrmCtrl', function () {

  // load the controller's module
  beforeEach(module('crmPostgresWebApp'));

  var CrmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CrmCtrl = $controller('CrmCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
