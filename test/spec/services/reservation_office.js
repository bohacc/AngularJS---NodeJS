'use strict';

describe('Service: ReservationOffice', function () {

  // load the service's module
  beforeEach(module('crmPostgresWebApp'));

  // instantiate service
  var ReservationOffice;
  beforeEach(inject(function (_ReservationOffice_) {
    ReservationOffice = _ReservationOffice_;
  }));

  it('should do something', function () {
    expect(!!ReservationOffice).toBe(true);
  });

});
