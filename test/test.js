'use strict';
var chai = require('chai');
var chaiStats = require('chai-stats');
var Clock = require('../lib/timetravel').Clock;

var timeout = require('./helpers').timeout;

chai.use(chaiStats);
var expect = chai.expect;

var tolerance = 5;

describe('Clock', function () {
	var clock;
	beforeEach(function () {
		clock = new Clock();
	});

	describe('constructor', function () {
		it('Should return a clock', function () {
			expect(new Clock()).to.be.an.instanceof(Clock);
		});
		it('Should accept time, speed, earliest, and latest options');
	});
	describe('#speed', function () {
		it('should return a number when called without arguments', function () {
			expect(clock.speed()).to.be.a('number');
		});
		it('should be 1 by default', function () {
			expect(clock.speed()).to.equal(1);
		});
		it('should be chainable', function () {
			expect(clock.speed(0)).to.equal(clock);
		});
		it('should be overloaded', function () {
			var speed = 500 - Math.random() * 1000;
			clock.speed(speed);
			expect(clock.speed()).to.equal(speed);
		});
		it('should set the speed of the clock', function (done) {
			var stoppedClock = new Clock().speed(0);
			var slowClock = new Clock().speed(1);
			var fastClock = new Clock().speed(5);
			var stoppedClockTime = stoppedClock.time();
			timeout(50, function (dTime, startTime) {
				expect(stoppedClock.time()).to.equal(stoppedClockTime);
				expect(slowClock.time() - startTime).to.be.closeTo(dTime, tolerance);
				expect(fastClock.time() - startTime).to.be.closeTo(dTime*5, tolerance);
				done();
			});
		});
		it('should trigger a speedchange event if the speed changes', function (done) {
			var initialSpeed = clock.speed();
			var eventCount = 0, changeCount = 0;
			clock.on('speedchange', function () {
				eventCount++;
				if (changeCount == 2) {
					expect(eventCount).to.equal(1);
					done();
				}
			});
			changeCount++;
			clock.speed(initialSpeed);
			changeCount++;
			clock.speed(2 * initialSpeed);
		})
	});
	describe('#stop', function () {
		it('should be chainable', function () {
			expect(clock.stop()).to.equal(clock);
		});
		it('should stop a running clock', function (done) {
			var stoppedClockTime = clock.stop().time();
			timeout(5, function () {
				expect(clock.time()).to.equal(stoppedClockTime);
				done();
			});
		});
		it('should set the speed to 0', function () {
			expect(clock.stop().speed()).to.equal(0);
		});
		it('should trigger a stop event', function (done) {
			clock.on('stop', function () { done(); });
			clock.stop();
		});
	});
	describe('#start', function () {
		it('should be chainable', function () {
			expect(clock.start()).to.equal(clock);
		});
		it('should start a stopped clock', function (done) {
			clock.stop();
			var stoppedClockTime = clock.time();
			clock.start();
			timeout(5, function (dTime, startTime) {
				expect(clock.time()).not.to.equal(stoppedClockTime);
				expect(clock.time() - startTime).to.be.closeTo(dTime, 5);
				done();
			});
		});
		it('should resume with the same speed as before', function () {
			var speedBefore = clock.speed(Math.random() * 1000).speed();
			clock.stop();
			clock.start();
			expect(clock.speed()).to.equal(speedBefore);
		});
		it('should trigger a start event', function (done) {
			clock.on('start', function () { done(); });
			clock.stop().start();
		});
		it('should trigger a speedchange event', function (done) {
			clock.stop();
			clock.on('speedchange', function () { done(); });
			clock.start();
		});
	});
	describe('#isStopped', function () {
		it('should return true if the clock is stopped and false if it is running', function () {
			expect(clock.stop().isStopped()).to.equal(true);
			expect(clock.start().isStopped()).to.equal(false);
		});
	});
	describe('#isRunning', function () {
		it('should return true if the clock is running and false if it is stopped', function () {
			expect(clock.stop().isRunning()).to.equal(false);
			expect(clock.start().isRunning()).to.equal(true);
		});
	});
	describe('#set', function () {
		it('should be chainable', function () {
			expect(clock.set(0)).to.equal(clock);
		});
		it('should set the clock\'s time');
		it('should accept anything that responds to valueOf');
	});
	describe('#get', function () {
		it('should return the clock\'s time');
		it('should return a number', function () {
			expect(clock.get()).to.be.a('number');
			expect(clock.get()).not.to.equal(NaN);
		});
	});
	describe('#time', function () {
		it('should do the same as #get without arguments');
		it('should do the same as #set with arguments');
	});
	describe('#earliest', function () {
		it('should be chainable', function () {
			expect(clock.earliest(0)).to.equal(clock);
		});
		it('should be overloaded');
		it('should set the lower bound of the clock');
	});
	describe('#latest', function () {
		it('should be chainable', function () {
			expect(clock.latest(0)).to.equal(clock);
		});
		it('should be overloaded');
		it('should set the upper bound of the clock');
	});
	describe('#on', function () {
		it('should be chainable', function () {
			expect(clock.on('', function () {})).to.equal(clock);
		});
		it('should accept a list of handlers separated by commas and/or whitespace', function (done) {
			var eventCount = 0;
			clock.on('start,stop speedchange', function () {
				eventCount++;
				if (eventCount >= 4) done();
			});
			clock.stop().start();
		});
		it('should accept an array of handlers', function (done) {
			var eventCount = 0;
			clock.on(['start', 'stop'], function () {
				eventCount++;
				if (eventCount >= 2) done();
			});
			clock.stop().start();
		});
	});
});
