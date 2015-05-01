var Main = require('../../public/js/routers/main.js');

describe("Main Router", function() {
  beforeEach(function() {
    this.router = new Main();
  });

  it("Should initialise a new main router", function(){
    expect(this.router instanceof Backbone.Router).toBe(true);
  });

  it("Should contain new route", function(){
    expect(this.router.routes.new).toBeDefined();
  });
});
