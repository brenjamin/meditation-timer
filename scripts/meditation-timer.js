// console.log($("#bells").find(".active").attr("id"));

function Timer(time, name) {
	this.time = time;
	this.name = name;
}

Timer.prototype = {
	started: false,
	timesRun: 0,
	done: false,

	setTime: function(time) {
		this.time = time;
	},

	getTime: function() {
		return this.time;
	},

	getText: function() {
		var minutes = Math.floor(this.time/60).toString();
		var seconds = (this.time - (minutes * 60)).toString();
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return minutes + ":" + seconds;
	},

	updateText: function() {
		var time = this.getText();

		$("#" + this.name + "-time").find(".time").text(time);
		$("#" + this.name).find(".time").text(time);
	},

	minuteUp: function() {
		this.time = this.time + 60;
	},

	minuteDown: function() {
		if (this.time > 59) {
			this.time = this.time - 60;
		}
	},

	secondDown: function() {
		if (this.time > 0) {
			this.time = this.time - 1;
		}
	},

	secondUp: function() {
		this.time = this.time + 1;
	}
}

function meditationTimer(time, name) {
	Timer.call(this, time, name);
	this.delay = 0;
	var self = this;

	this.start = function() {
		var bell = $(getActiveBell());
		if (!this.started) {
			this.startTime = this.time;
		}
		if ((!bell.get(0).ended) && (bell.get(0).currentTime != 0)) {
			bell.get(0).play();
		}
		this.timeout = setTimeout(this.countdown, this.delay*1000);
	}

	this.countdown = function() {
		if (!self.started) {
			makeVisible(self.name);
			makeActive(self.name);
			$(getActiveBell()).get(0).play();
			self.started = true;
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.end();
				}
			}, 1000);
		}
		else {
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.end();
				}
			}, 1000);
		}
	};

	this.stop = function() {
		clearInterval(this.intervalID);
		clearTimeout(this.timeout);
		this.setTime(this.startTime);
		this.updateText();
		this.started = false;
		this.timesRun = 0;
		$(getActiveBell()).get(0).pause();
		$(getActiveBell()).get(0).currentTime = 0;
	};

	this.pause = function() {
		clearInterval(self.intervalID);
		clearTimeout(self.timeout);
		$(getActiveBell()).get(0).pause();
	};

	this.end = function() {
		intTimer.stop();
		delTimer.stop();
		this.setTime(this.startTime);
		this.updateText();
		this.started = false;
		this.timesRun = 0;
		$(getActiveBell).get(0).currentTime = 0;
		$(getActiveBell()).get(0).play();
		hide('stop-button');
		hide('pause-button');
		show('start-button');
		showArrows();
	};

	this.resume = function() {
		this.start();
	};

	this.setDelay = function(delay) {
		this.delay = delay;
	}

}

function delayTimer(time, name) {
	Timer.call(this, time, name);
	var self = this;
	this.done = false;

	this.start = function() {
		if (!this.done) {
			makeVisible(this.name);
			makeActive(this.name);
			if (!this.started) {
				this.startTime = this.time;
			}
			this.countdown();
			$(getActiveBellShort()).get(0).pause();
			$(getActiveBellShort()).get(0).currentTime = 0;
		}
	}


	this.countdown = function() {
		if (!self.started) {
			self.started = true;
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.done = true;
				}
			}, 1000);	
		}
		else {
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.done = true;
				}
			}, 1000);
		}
	};

	this.stop = function() {
		clearInterval(this.intervalID);
		this.setTime(this.startTime);
		this.updateText();
		this.started = false;
		this.timesRun = 0;
		this.done = false;
	};

	this.pause = function() {
		clearInterval(self.intervalID);
	};
}

function intervalTimer(time, name) {
	Timer.call(this, time, name);
	var self = this;
	this.delay = 0;
	this.done = false;

	this.start = function() {
		if (this.time === 0) {
			this.done = true;
			this.startTime = 0;
		}
		if (!this.done) {
			if (!this.started) {
				this.startTime = this.time;
			}
			this.timeout = setTimeout(this.countdown, this.delay*1000);
		}
	};

	this.countdown = function() {
		if (!self.started) {
			self.started = true;
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.end();
				}
			}, 1000);
		}
		else {
			self.intervalID = setInterval(function() {
				self.timesRun++;
				self.secondDown();
				self.updateText();
				if (self.timesRun >= self.startTime) {
					clearInterval(self.intervalID);
					self.end();
				}
			}, 1000);
		}
	};

	this.stop = function() {
		clearInterval(this.intervalID);
		clearTimeout(this.timeout);
		this.setTime(this.startTime);
		this.updateText();
		this.started = false;
		this.done = false;
		this.timesRun = 0;
	};

	this.pause = function() {
		clearInterval(self.intervalID);
		clearTimeout(self.timeout);
	};

	this.end = function() {
		$(getActiveBellShort()).get(0).play();
		this.done = true;
	};

	this.resume = function() {
		this.start();
	};

	this.setDelay = function(delay) {
		this.delay = delay;
	}


}


meditationTimer.prototype = Object.create(Timer.prototype);
meditationTimer.prototype.constructor = meditationTimer;
delayTimer.prototype = Object.create(Timer.prototype);
delayTimer.prototype.constructor = delayTimer;
intervalTimer.prototype = Object.create(Timer.prototype);
intervalTimer.prototype.constructor = intervalTimer;

var medTimer = new meditationTimer(600, 'meditation');
var delTimer = new delayTimer(10, 'delay');
var intTimer = new intervalTimer(0, 'interval');

// $('#delay-time').find('.time').text(delTimer.getText());
// $('#meditation-time').find('.time').text(medTimer.getText());
// $('#interval-time').find('.time').text(intTimer.getText());
// $('#delay').find('.small-time').text(delTimer.getText());
// $('#meditation').find('.small-time').text(medTimer.getText());
// $('#interval').find('.small-time').text(intTimer.getText());

function makeActive(id) {
	$('#' + id).addClass('active').siblings().removeClass('active');
}

function makeVisible(id) {
	var visibleTimer = '#' + $('#timers').find('.visible').attr('id');
	$(visibleTimer).removeClass('visible').addClass('invisible');
	$('#' + id + '-time').removeClass('invisible').addClass('visible');
}

function highlight() {
	//$(this).css('background-color', '#375661');
	$(this).addClass('highlighted');
}

function unhighlight() {
	//$(this).css('background-color', '#23444E');
	$(this).removeClass('highlighted');
}

function hide(id) {
	$('#' + id).addClass('hidden');
}

function show(id) {
	$('#' + id).removeClass('hidden');
}

function soundBell(id) {
	var activeId = '#'+ $('#' + id).parent().children('.playing').attr('id');
	$(activeId + '-audio').get(0).pause();
	$(activeId + '-audio').get(0).currentTime = 0;
	$(activeId).removeClass('playing');
	$('#' + id).addClass('playing'); 
	$('#' + id + '-audio').get(0).play();
}

function activateArrow(id) {
	var timer = getActiveTimer();
	switch(id) {
		case 'minute-up':
			timer.minuteUp();
			break;
		case 'minute-down':
			timer.minuteDown();
			break;
		case 'second-up':
			timer.secondUp();
			break;
		case 'second-down':
			timer.secondDown();
			break;
	}	
	timer.updateText();
}

function getActiveTimer() {
	var active = $('.visible').attr('id');
	if (active == 'meditation-time') {
		var timer = medTimer;
	}
	else if (active == 'delay-time') {
		var timer = delTimer;
	}
	else if (active =='interval-time') {
		var timer = intTimer;
	}
	return timer;
}

function getActiveBell() {
	var bell = $("#bells").find(".active").attr("id");
	return ("#" + bell + "-long-audio");
}

function getActiveBellShort() {
	var bell = $("#bells").find(".active").attr("id");
	return ("#" + bell + "-audio");
}

function hideArrows() {
	$("#arrows-up").removeClass("visible-arrow");
	$("#arrows-down").removeClass("visible-arrow");
	$("#arrows-up").addClass("invisible-arrow");
	$("#arrows-down").addClass("invisible-arrow");
}

function showArrows() {
	$("#arrows-up").addClass("visible-arrow");
	$("#arrows-down").addClass("visible-arrow");
	$("#arrows-up").removeClass("invisible-arrow");
	$("#arrows-down").removeClass("invisible-arrow");
}

function resume() {
	hide('resume-button');
	show('pause-button');
	delTimer.start();
	medTimer.start();
	intTimer.start();
}

function start() {
	hide('start-button');
	show('stop-button');
	show('pause-button');
	medTimer.setDelay(delTimer.time);
	intTimer.setDelay(delTimer.time);
	hideArrows();
	delTimer.start();
	medTimer.start();
	intTimer.start();
}

function stop() {
	delTimer.stop();
	medTimer.stop();
	intTimer.stop();
	hide('stop-button');
	hide('pause-button');
	show('start-button');
	showArrows();
	makeActive('meditation');
	makeVisible('meditation');
}

function pause() {
	delTimer.pause();
	medTimer.pause();
	intTimer.pause();
	medTimer.setDelay(delTimer.time);
	intTimer.setDelay(delTimer.time);
	hide('pause-button');
	show('resume-button');
}

function init() {
	$('#timer-buttons').on('click', '.button', function() {makeActive(this.id);});
	$('#timer-buttons').on('click', '.button', function() {makeVisible(this.id);});
	$('#timer-buttons').on('mouseenter', '.button', highlight);
	$('#timer-buttons').on('mouseleave', '.button', unhighlight);
	$('#bells').on('mouseenter', '.button', highlight);
	$('#bells').on('mouseleave', '.button', unhighlight);
	$('#bells').on('click', '.button', function() {soundBell(this.id);});
	$('#bells').on('click', '.button', function() {makeActive(this.id);});
	$('#start-stop-buttons').on('mouseenter', '.button', highlight);
	$('#start-stop-buttons').on('mouseleave', '.button', unhighlight);
	$('#timer').on('click', '.arrow', function() {activateArrow(this.id);});
	$('#start-button').on('click', start);
	$('#stop-button').on('click', stop);
	$('#pause-button').on('click', pause);
	$('#resume-button').on('click', resume);
	$(function() {
		$("#info-dialog").dialog({
			autoOpen: false,
			show: 'fade',
			hide: 'drop',
			modal: true,
			width: 450,
			minWidth: 700,
			maxHeight: 1200
		});
		$("#info").on("click", function() {
			$("#info-dialog").dialog("open");
		});
	});

	$(function() {
		$("#contact-dialog").dialog({
			autoOpen: false,
			show: 'fade',
			hide: 'drop',
			modal: true,
			width: 'auto'
	});
	$("#contact").on("click", function() {
		$("#contact-dialog").dialog("open");
		});
	});
}

$(document).ready(function() {
	init();
});