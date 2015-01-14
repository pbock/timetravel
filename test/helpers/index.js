'use strict';
function timeout (duration, then) {
	var startTime = Date.now();
	setTimeout(function () {
		var dTime = Date.now() - startTime;
		then(dTime, startTime);
	}, duration);
}
module.exports = {
	timeout: timeout,
};
