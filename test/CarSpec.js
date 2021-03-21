var Car = artifacts.require('./Car');
var assert = require("chai").assert;
var truffleAssert = require('truffle-assertions');

contract('Car', function (accounts) {
    var carInstance;

    beforeEach(async () => {
        carInstance = await Car.new();
    });

    it("CarSpec ", async () => {
       
    });

});