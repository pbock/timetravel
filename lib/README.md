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

