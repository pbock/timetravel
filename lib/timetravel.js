'use strict';
/** @namespace */
/** 
 * Initializes the clock
 * @param {Object} [options]
 * @param {Number} [options.time]
 *    The time at which the clock starts. Defaults to the
 *    current system time.
 * @param {Number} [options.speed]
 *    How much faster the simulated clock advances compared to a
 *    real clock. A `speed` of 1 is real-time; 10 is ten times real-time;
 *    -1 reverses time; etc.
 *    Defaults to 1.
 * @param {Number} [options.earliest]
 *    The lower bound for the simulated time. Defaults to 0.
 * @param {Number} [options.latest]
 *    The upper bound for the simulated time. Defaults to `Infinity`.
 * @memberof Clock
 */
var Clock = function (options) { // jshint ignore:line
var me = this;

// Remains undefined; used to check other variables against.
var undefined; // jshint ignore:line
// Reference points for the simulation.
var simTimeAtLastManipulation, realTimeAtLastManipulation;

var eventHandlers = {};
var simTimeAtLastTick;

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
function _heartbeatInterval () {
	var simTimeAtCurrentTick = _simTime();
	if (simTimeAtCurrentTick !== simTimeAtLastTick) _trigger('tick');
	simTimeAtLastTick = simTimeAtCurrentTick;
	_tick(_heartbeatInterval);
}

/**
 * Sets the clock.
 * @param {Number|Date} time
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
 */
function _get () {
	return _simTime();
}
var _tick;
try {
	_tick = requestAnimationFrame || null;
} catch (e) {
	_tick = function (callback) {
		setTimeout(callback, 20);
	};
}

var previousSpeed;
/**
 * - If an argument is provided, sets the speed of the simulation.
 * - If no argument is provided, returns the current speed.
 * @param {Number} [speed]
 * @returns {Number}
 * @memberof Clock
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
 * @memberof Clock
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
 * @memberof Clock
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
 * @memberof Clock
 */
function isStopped () {
	return !speed();
}

/**
 * Returns true if the clock is currently running, otherwise false.
 * @returns {Boolean}
 * @memberof Clock
 */
function isRunning () {
	return !!speed();
}

/**
 * - If an argument is provided, sets the simulated time.
 * - If no argument is provided, returns the current simulated time as a
 *   unix timestamp.
 * @param {Number} [time]
 * @returns {Number}
 * @memberof Clock
 */
function time (t) {
	if (t === undefined) return _get();
	return _set(t);
}

/**
 * Sets or gets the current lower bound of the clock.
 * @param {Number} [minTime]
 * @returns {Number}
 * @memberof Clock
 */
function earliest (minTime) {
	if (minTime === undefined) return o.earliest;
	o.earliest = minTime;
	return me;
}

/**
 * Sets or gets the current upper bound of the clock.
 * @param {Number} [maxTime]
 * @returns {Number}
 * @memberof Clock
 */
function latest (maxTime) {
	if (maxTime === undefined) return o.latest;
	o.latest = maxTime;
	return me;
}

/**
 * Attaches an event handler.
 * @param {String} handlers
 *   The event(s) to listen to. Possible values are `start`, `stop`,
 *   `speedchange`, `timechange`.
 *   Can be a space-separated list.
 * @param {Function} callback
 *   A function that will be called when the event is fired.
 * @memberof Clock
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
_tick(_heartbeatInterval);

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

module.exports = {
	Clock: Clock
};
