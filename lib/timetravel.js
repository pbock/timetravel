'use strict';
(function (root, factory) {
	// Module export pattern
	// https://github.com/umdjs/umd/blob/master/returnExports.js
	/* global define */
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.timetravel = factory();
	}
})(this, function () { // jshint ignore:line
// Remains undefined; used to check other variables against.
var undefined; // jshint ignore:line

/**
 * @module Clock
 * @namespace timetravel */
/** 
 * Creates a new simulation clock. The constructor is currently
 * optimised for ease-of-use rather than performance, and while there is
 * nothing stopping you from creating a million clock instances,
 * it is inadvisable.
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.time]
 *    The time at which the clock starts. Defaults to the
 *    current system time.
 * @param {Number} [options.speed]
 *    The value by which the time will be incremented for each real-time
 *    millisecond, i.e. how much faster the simulated clock advances
 *    compared to a real clock. A `speed` of 1 is real-time;
 *    10 is ten times real-time; -1 reverses time; etc.
 *    Defaults to 1.
 * @param {Number} [options.earliest]
 *    The lower bound for the simulated time. Defaults to `-Infinity`.
 * @param {Number} [options.latest]
 *    The upper bound for the simulated time. Defaults to `Infinity`.
 * @memberof timetravel
 *//**
 * Can also be used as a factory
 * @function
 * @param {Object} [options]
 */
var Clock = function (options) { // jshint ignore:line

// Act as a factory when called directly
if (this.Clock) {
	return new Clock(options);
}
var me = this;
// Reference points for the simulation.
var simTimeAtLastManipulation, realTimeAtLastManipulation;

var eventHandlers = {};

// Options object; will be merged with the other options.
var o = {
	time: Date.now(),
	speed: 1,
	earliest: -Infinity,
	latest: Infinity
};

// Triggers an event handler.
function _trigger (handler) {
	if (!eventHandlers[handler]) return;
	for (var i=0, l=eventHandlers[handler].length; i<l; i++) {
		eventHandlers[handler][i](_simTime());
	}
}
// Returns the real unix time
function _realTime () {
	return (new Date()).valueOf();
}
// Returns the current simulated time
function _simTime () {
	var t = simTimeAtLastManipulation + isRunning() * o.speed * _realTimeSinceLastManipulation();
	return _bounded(t);
}
// Returns the milliseconds elapsed since the clock was last manipulated
function _realTimeSinceLastManipulation () {
	return _realTime() - realTimeAtLastManipulation;
}
// Called whenever there are manipulations that change properties of the clock
// to update the reference times.
function _willManipulate () {
	simTimeAtLastManipulation = _simTime();
	realTimeAtLastManipulation = _realTime();
}
// Helper that makes sure a given time is within the upper and lower bounds
// specified in the options.
function _bounded (t) {
	return Math.max(o.earliest, Math.min(o.latest, t));
}

/**
 * Sets the clock.
 * @param {Number|Date} time
 * @ignore
 */
function _set (t) {
	_willManipulate();
	simTimeAtLastManipulation = _bounded(t.valueOf());
	_trigger('timechange');
	return me;
}

/**
 * Returns the current simulated time as a unix timestamp.
 * @returns {Number}
 * @ignore
 */
function _get () {
	return _simTime();
}

var previousSpeed;
/**
 * Returns the current speed.
 * @returns {Number} The current speed of the clock
 * @memberof timetravel.Clock
 * @instance
 *//**
 * Sets the speed of the simulation, i.e. the value by which the simulated
 * clock will be incremented for each real-time millisecond.
 * @param {Number} speed
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @fires speedchange
 * @instance
 */
function speed (val) {
	if (val === undefined) return o.speed;
	_willManipulate();
	o.speed = val;
	if (previousSpeed !== val) _trigger('speedchange');
	previousSpeed = val;
	return me;
}

var speedBackup;
/**
 * Starts the clock if it has been stopped before.
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @fires start
 * @instance
 */
function start () {
	if (isStopped()) {
		_willManipulate();
		speed(speedBackup);
		_trigger('start');
	}
	return me;
}

/**
 * Stops the clock. Equivalent to calling `Clock.speed(0)`, except that
 * the current speed will be remembered and can be resumed later on.
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @fires stop
 * @instance
 */
function stop () {
	if (isRunning()) {
		_willManipulate();
		speedBackup = speed();
		speed(0);
		_trigger('stop');
	}
	return me;
}

/**
 * Returns true if the clock is currently stopped, otherwise false.
 * @returns {Boolean}
 * @memberof timetravel.Clock
 * @instance
 */
function isStopped () {
	return !speed();
}

/**
 * Returns true if the clock is currently running, otherwise false.
 * @returns {Boolean}
 * @memberof timetravel.Clock
 * @instance
 */
function isRunning () {
	return !!speed();
}

/**
 * Returns the current simulated time as a unix timestamp.
 * @returns {Number}
 * @memberof timetravel.Clock
 * @instance
 *//**
 * Sets the simulated time.
 * @param {Number} time
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @fires timechange
 * @instance
 */
function time (t) {
	if (t === undefined) return _get();
	return _set(t);
}

/**
 * Returns the current lower bound of the clock.
 * @returns {Number} The current lower bound of the clock.
 * @memberof timetravel.Clock
 * @instance
 *//**
 * Sets the current lower bound of the clock.
 * @param {Number} minTime
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @instance
 */
function earliest (minTime) {
	if (minTime === undefined) return o.earliest;
	o.earliest = minTime;
	return me;
}

/**
 * Returns the current upper bound of the clock.
 * @returns {Number} The current upper bound of the clock.
 * @memberof timetravel.Clock
 * @instance
 *//**
 * Sets the current upper bound of the clock.
 * @param {Number} maxTime
 * @returns {Clock} The clock instance itself (chainable)
 * @memberof timetravel.Clock
 * @instance
 */
function latest (maxTime) {
	if (maxTime === undefined) return o.latest;
	o.latest = maxTime;
	return me;
}

/**
 * Attaches an event handler.
 * @param {String} events
 *   The event(s) to listen to. Possible values are `start`, `stop`,
 *   `speedchange`, `timechange`.
 *   A list of events can be an array or a space- or comma-separated string.
 * @param {Function} callback
 *   A function that will be called when the event is fired.
 * @memberof timetravel.Clock
 * @instance
 */
function on (handlers, callback) {
	if (typeof handlers === 'string') handlers = handlers.split(/[,\s]+/g);
	handlers.forEach(function (handler) {
		if (!eventHandlers[handler]) eventHandlers[handler] = [];
		eventHandlers[handler].push(callback);
	});
	return me;
}

// Initialise the clock
if (options) {
	Object.keys(options).forEach(function (key) {
		if (options.hasOwnProperty(key)) o[key] = options[key];
	});
}
previousSpeed = speed();
_set(o.time.valueOf());

this.time = time;
this.speed = speed;
this.earliest = earliest;
this.latest = latest;
this.start = start;
this.stop = stop;
this.isStopped = isStopped;
this.isRunning = isRunning;
this.on = on;
};

return {
	Clock: Clock
};
});
