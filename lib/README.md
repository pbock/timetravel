# timetravel

A tiny module that simulates time in JavaScript.

    var Clock = require('timetravel').Clock;
    // Or use the global timetravel object if you're using old-school script tags in the browser
    
    var c = Clock({
	    time: new Date(2020, 0, 1),
	    speed: 2.592e9, // 30 days per second
	    earliest: new Date(2020, 0, 1),
	    latest: new Date(2030, 0, 1) - 1
    });

