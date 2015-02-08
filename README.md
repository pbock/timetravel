# Timetravel

A tiny module that simulates time in JavaScript.

    var c = Timetravel.Clock();
    c.time(0).speed(10);
    setTimeout(function () {
	    console.log('The simulated time is', c.time());
	    //=> The simulated time is 420
    }, 42);

_Timetravel_ works as a general-purpose counter that increments by a set amount each millisecond. It can be set, sped up, paused and restarted. There are no “moving parts”; the time is only calculated when needed. While you’re not using it, the clock does absolutely nothing.

_Timetravel_ is tiny (1.5 KB minified), fully tested, has no dependencies, and works just about anywhere. You can `require` it Node- or AMD-style or embed it the old-fashioned way with a `<script>` tag.

## Is _Timetravel_ right for me?

_Timetravel_ works really well for models that can be expressed as a function of time, e.g. planet constellations or public transport networks.

It’s near-useless for iterative simulations that work in ‘ticks’ where the state at any point in time depends on what happened before, e.g. Conway’s _Game of Life_.

## How do I use _Timetravel_?

If you’re using a packet manager (you are, aren’t you?), you can install it with `npm install timetravel` or `bower install timetravel`. Otherwise you can [download it manually](https://github.com/pbock/timetravel/tree/master/dist).

To include it in your project, `require` it (Node and AMD style are supported) on the server or [in the browser](http://browserify.org/) or keep polluting that global namespace and use a `<script>` tag if you must.

    // Node style:
    var Clock = require('timetravel').Clock;
    // Or if you're using global variables:
    // var Clock = Timetravel.Clock;
    
    // Make a new clock
    var c = Clock();
    
    // It's already running, let's stop it
    c.stop();
    
    // Set it to 1000 times real time and one year back:
    c.speed(1000).time(c.time() - 3.16e10);
    
    // Start it up again
    c.start();
    
    // Periodically log the current time
    setInterval(function () {
	    console.log('The time is', new Date(c.time()));
    }, 1000);

You can find a complete documentation at the bottom of this document.

## Who made this?

_Timetravel_ is written and maintained by [Philipp Bock](http://philippbock.de) from [OpenDataCity](https://opendatacity.de).

<a name="timetravel"></a>
## timetravel → <code>object</code>

* [timetravel](#timetravel) → <code>object</code>
  * [class: .Clock](#timetravel.Clock)
    * [new Clock([options])](#new_timetravel.Clock_new)
    * _instance_
      * [.speed()](#timetravel.Clock#speed) ⇒ <code>Number</code>
      * [.speed(speed)](#timetravel.Clock#speed) ⇒ <code>Clock</code>
      * [.start()](#timetravel.Clock#start) ⇒ <code>Clock</code>
      * [.stop()](#timetravel.Clock#stop) ⇒ <code>Clock</code>
      * [.isStopped()](#timetravel.Clock#isStopped) ⇒ <code>Boolean</code>
      * [.isRunning()](#timetravel.Clock#isRunning) ⇒ <code>Boolean</code>
      * [.time()](#timetravel.Clock#time) ⇒ <code>Number</code>
      * [.time(time)](#timetravel.Clock#time) ⇒ <code>Clock</code>
      * [.earliest()](#timetravel.Clock#earliest) ⇒ <code>Number</code>
      * [.earliest(minTime)](#timetravel.Clock#earliest) ⇒ <code>Clock</code>
      * [.latest()](#timetravel.Clock#latest) ⇒ <code>Number</code>
      * [.latest(maxTime)](#timetravel.Clock#latest) ⇒ <code>Clock</code>
      * [.on(events, callback)](#timetravel.Clock#on)

<a name="timetravel.Clock"></a>
### class: timetravel.Clock

* [class: .Clock](#timetravel.Clock)
  * [new Clock([options])](#new_timetravel.Clock_new)
  * _instance_
    * [.speed()](#timetravel.Clock#speed) ⇒ <code>Number</code>
    * [.speed(speed)](#timetravel.Clock#speed) ⇒ <code>Clock</code>
    * [.start()](#timetravel.Clock#start) ⇒ <code>Clock</code>
    * [.stop()](#timetravel.Clock#stop) ⇒ <code>Clock</code>
    * [.isStopped()](#timetravel.Clock#isStopped) ⇒ <code>Boolean</code>
    * [.isRunning()](#timetravel.Clock#isRunning) ⇒ <code>Boolean</code>
    * [.time()](#timetravel.Clock#time) ⇒ <code>Number</code>
    * [.time(time)](#timetravel.Clock#time) ⇒ <code>Clock</code>
    * [.earliest()](#timetravel.Clock#earliest) ⇒ <code>Number</code>
    * [.earliest(minTime)](#timetravel.Clock#earliest) ⇒ <code>Clock</code>
    * [.latest()](#timetravel.Clock#latest) ⇒ <code>Number</code>
    * [.latest(maxTime)](#timetravel.Clock#latest) ⇒ <code>Clock</code>
    * [.on(events, callback)](#timetravel.Clock#on)

<a name="new_timetravel.Clock_new"></a>
#### new Clock([options])
Creates a new simulation clock. The constructor is currently
optimised for ease-of-use rather than performance, and while there is
nothing stopping you from creating a million clock instances,
it is inadvisable.


| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> |  |
| [options.time] | <code>Number</code> | The time at which the clock starts. Defaults to the    current system time. |
| [options.speed] | <code>Number</code> | The value by which the time will be incremented for each real-time    millisecond, i.e. how much faster the simulated clock advances    compared to a real clock. A `speed` of 1 is real-time;    10 is ten times real-time; -1 reverses time; etc.    Defaults to 1. |
| [options.earliest] | <code>Number</code> | The lower bound for the simulated time. Defaults to `-Infinity`. |
| [options.latest] | <code>Number</code> | The upper bound for the simulated time. Defaults to `Infinity`. |

<a name="timetravel.Clock#speed"></a>
#### clock.speed() ⇒ <code>Number</code>
Returns the current speed.

**Returns**: <code>Number</code> - The current speed of the clock  
<a name="timetravel.Clock#speed"></a>
#### clock.speed(speed) ⇒ <code>Clock</code>
Sets the speed of the simulation, i.e. the value by which the simulated
clock will be incremented for each real-time millisecond.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  
**Emits**: <code>event:speedchange</code>  

| Param | Type |
| --- | --- |
| speed | <code>Number</code> | 

<a name="timetravel.Clock#start"></a>
#### clock.start() ⇒ <code>Clock</code>
Starts the clock if it has been stopped before.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  
**Emits**: <code>event:start</code>  
<a name="timetravel.Clock#stop"></a>
#### clock.stop() ⇒ <code>Clock</code>
Stops the clock. Equivalent to calling `Clock.speed(0)`, except that
the current speed will be remembered and can be resumed later on.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  
**Emits**: <code>event:stop</code>  
<a name="timetravel.Clock#isStopped"></a>
#### clock.isStopped() ⇒ <code>Boolean</code>
Returns true if the clock is currently stopped, otherwise false.

<a name="timetravel.Clock#isRunning"></a>
#### clock.isRunning() ⇒ <code>Boolean</code>
Returns true if the clock is currently running, otherwise false.

<a name="timetravel.Clock#time"></a>
#### clock.time() ⇒ <code>Number</code>
Returns the current simulated time as a unix timestamp.

<a name="timetravel.Clock#time"></a>
#### clock.time(time) ⇒ <code>Clock</code>
Sets the simulated time.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  
**Emits**: <code>event:timechange</code>  

| Param | Type |
| --- | --- |
| time | <code>Number</code> | 

<a name="timetravel.Clock#earliest"></a>
#### clock.earliest() ⇒ <code>Number</code>
Returns the current lower bound of the clock.

**Returns**: <code>Number</code> - The current lower bound of the clock.  
<a name="timetravel.Clock#earliest"></a>
#### clock.earliest(minTime) ⇒ <code>Clock</code>
Sets the current lower bound of the clock.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  

| Param | Type |
| --- | --- |
| minTime | <code>Number</code> | 

<a name="timetravel.Clock#latest"></a>
#### clock.latest() ⇒ <code>Number</code>
Returns the current upper bound of the clock.

**Returns**: <code>Number</code> - The current upper bound of the clock.  
<a name="timetravel.Clock#latest"></a>
#### clock.latest(maxTime) ⇒ <code>Clock</code>
Sets the current upper bound of the clock.

**Returns**: <code>Clock</code> - The clock instance itself (chainable)  

| Param | Type |
| --- | --- |
| maxTime | <code>Number</code> | 

<a name="timetravel.Clock#on"></a>
#### clock.on(events, callback)
Attaches an event handler.


| Param | Type | Description |
| --- | --- | --- |
| events | <code>String</code> | The event(s) to listen to. Possible values are `start`, `stop`,   `speedchange`, `timechange`.   A list of events can be an array or a space- or comma-separated string. |
| callback | <code>function</code> | A function that will be called when the event is fired. |

