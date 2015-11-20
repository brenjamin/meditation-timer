var meditationTime = new Timer('15', '00', 'meditation');
var delayTime = new Timer('00', '10', 'delay');
var intervalTime = new Timer('00', '00', 'interval');

$('#delay-time').find('.time').text(delayTime.timeText);
$('#meditation-time').find('.time').text(meditationTime.timeText);
$('#interval-time').find('.time').text(intervalTime.timeText);
$('#delay').find('.small-time').text(delayTime.timeText);
$('#meditation').find('.small-time').text(meditationTime.timeText);
$('#interval').find('.small-time').text(intervalTime.timeText);

function activate() {
	$(this).addClass('active').siblings().removeClass('active');
}

function toggleTimer(id) {
	var visibleTimer = '#' + $('#timers').find('.visible').attr('id');
	$(visibleTimer).removeClass('visible').addClass('invisible');
	$('#' + id + '-time').removeClass('invisible').addClass('visible');
}

function highlight() {
	$(this).css('background-color', '#FAD0B8');
}

function unhighlight() {
	$(this).css('background-color', '#FEB68E');
}

function soundBell(id) {
	var activeId = '#'+ $('#' + id).parent().children('.playing').attr('id');
	console.log(activeId);
	$(activeId + '-audio').get(0).pause();
	$(activeId + '-audio').get(0).currentTime = 0;
	$(activeId).removeClass('playing');
	$('#' + id).addClass('playing'); 
	$('#' + id + '-audio').get(0).play();
}

function Timer(minutes, seconds, name) {
	var self = this;
	this.time = time;
	this.timeText = this.timeArray.join(":");
	this.bigDisplay = '#' + name + '-time';
	this.smallDisplay = '#' + name + '-small';
	this.paused = false;

	this.minuteUp = function() {
		this.timeArray[0] = (parseInt(this.timeArray[0]) + 1).toString();
		if (this.timeArray[0] < 10) {
			this.timeArray[0] = '0' + this.timeArray[0];
		}

		self.updateDisplay();
	};

	this.setTime = function(time) {
		$(this.bigDisplay).text(time);
		$(this.smallDisplay).text(time);

	}

	this.getTime = function() {
		return (parseInt(self.timeArray[0]*60) + parseInt(self.timeArray[1])) * 1000;
	}

	this.minuteDown = function() {
		if (this.timeArray[0] > 0) {
			this.timeArray[0] = (parseInt(this.timeArray[0]) - 1).toString();
			if (this.timeArray[0] < 10) {
			this.timeArray[0] = '0' + this.timeArray[0];
			}
		}

		self.updateDisplay();
	};

	this.secondDown = function() {
		console.log(self.timeArray);
		if (self.timeArray[1] == '00') {
			if (self.timeArray[0] > 0) {
				self.timeArray[1] = '59';
				self.timeArray[0] = (parseInt(self.timeArray[0]) - 1).toString();
				if (self.timeArray[0] < 10) {
					self.timeArray[0] = '0' + self.timeArray[0];
				}	
			}
		}
		else if (self.timeArray[1] <= 10) {
			self.timeArray[1] = '0' + (parseInt(self.timeArray[1]) - 1).toString();
			}
		else {
			self.timeArray[1] = (parseInt(self.timeArray[1]) - 1).toString();
		}

		self.updateDisplay();
	};

	this.secondUp = function() {
		if (this.timeArray[1] == 59) {
			this.timeArray[1] = '00';
			this.timeArray[0] = (parseInt(this.timeArray[0]) + 1).toString();
			if (this.timeArray[0] < 9) {
				this.timeArray[0] = '0' + this.timeArray[0];
			}
		}
		else if (this.timeArray[1] < 9) {
			this.timeArray[1] = '0' + (parseInt(this.timeArray[1]) + 1).toString();
		}
		else {
			this.timeArray[1] = (parseInt(this.timeArray[1]) + 1).toString();
		}

		self.updateDisplay();

	};

	this.start = function() {
		self.startTime = self.timeArray.join(":");
		self.intervalId = setInterval(self.secondDown, 1000);
	};

	this.updateDisplay = function() {
		this.timeText = this.timeArray.join(":");
		$(this.bigDisplay).text(this.timeText);
		$(this.smallDisplay).text(this.timeText);
	}

	this.stop = function() {
		clearInterval(self.intervalId);
		clearInterval(self.restartId);
		$('#stop-button').addClass('hidden');
		$('#pause-button').addClass('hidden');
		$('#start-button').removeClass('hidden');
		self.reset();
	}

	this.reset = function() {
		self.setTime(self.startTime);
		self.timeArray = (self.startTime).split(":");
	}

	this.restart = function() {

	 	self.restartId = setInterval(self.secondDown, 1000);
	}

	this.pause = function() {
		if (self.paused) {
			clearInterval(self.restartId);
			self.restart();
			$('#pause-button').text('Pause');
			self.paused = false;
		}
		else {
			clearInterval(self.intervalId);
			clearInterval(self.restartId);
			$('#pause-button').text('Resume');
			self.paused = true;
		}
	}

}

function activateArrow(id) {
	var active = $('.visible').attr('id');
	if (active == 'meditation-time') {
		var timer = meditationTime;
	}
	else if (active == 'delay-time') {
		var timer = delayTime;
	}
	else if (active =='interval-time') {
		var timer = intervalTime;
	}

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



	$('.visible').find('.time').text(timer.timeText);
	$('#buttons').find('.active').find('p').text(timer.timeText);
	

	
}

function start() {
	$('#start-button').addClass('hidden');
	$('#stop-button').removeClass('hidden');
	$('#pause-button').removeClass('hidden');
	toggleTimer("delay");
	$('#meditation').removeClass('active');
	$('#delay').addClass('active');
	var delay = delayTime.getTime();
	delayTime.start();
	setTimeout(meditationTime.start, delay);
	// $('#meditation').addClass('active');
	// $('#delay').removeClass('active');


}

function stop() {
	meditationTime.stop();
	delayTime.stop();
	intervalTime.stop();
}

function pause() {
	meditationTime.pause();
	delayTime.pause();
	intervalTime.pause();
}

$(document).ready(function() {
	$('#timer-buttons').on('click', '.button', activate);
	$('#timer-buttons').on('click', '.button', function() {toggleTimer(this.id);});
	$('#timer-buttons').on('mouseenter', '.button', highlight);
	$('#timer-buttons').on('mouseleave', '.button', unhighlight);
	$('#bells').on('mouseenter', '.button', highlight);
	$('#bells').on('mouseleave', '.button', unhighlight);
	$('#bells').on('click', '.button', function() {soundBell(this.id);});
	$('#bells').on('click', '.button', activate);
	$('#start-stop-buttons').on('mouseenter', '.button', highlight);
	$('#start-stop-buttons').on('mouseleave', '.button', unhighlight);
	$('#timer').on('click', '.arrow', function() {activateArrow(this.id);});
	$('#start-button').on('click', start);
	$('#stop-button').on('click', stop);
	$('#pause-button').on('click', pause);
	$('#resume-button').on('click', start);

});

// function Timer(time, name) {
// 	var this = this;
// 	this.time = time;
// 	this.name = name;
// 	this.bigDisplay = '#' + name + '-time';
// 	this.smallDisplay = '#' + name + '-small';
// 	this.started = false;
// 	this.timesRun = 0;
// 	this.done = false;
// 	this.delay = 0;

// 	this.setTime = function(time) {
// 		this.time = time;
// 	}

// 	this.getTime = function() {
// 		return this.time;
// 	}

// 	this.getText = function() {
// 		var minutes = Math.floor(this.time/60).toString();
// 		var seconds = (this.time - (minutes * 60)).toString();
// 		if (minutes < 10) {
// 			minutes = "0" + minutes;
// 		}
// 		if (seconds < 10) {
// 			seconds = "0" + seconds;
// 		}
// 		return minutes + ":" + seconds;
// 	}

// 	this.setText = function() {
// 		var time = this.getText();
// 		$("#" + this.name + "-time").find(".time").text(time);
// 		$("#" + this.name).find(".time").text(time);
// 	}

// 	this.minuteUp = function() {
// 		this.time = this.time + 60;
// 		this.setText(this.time);
// 	};

// 	this.minuteDown = function() {
// 		if (this.time > 59) {
// 			this.time = this.time - 60;
// 		}
// 		this.setText(this.time);
// 	};

// 	this.secondDown = function() {
// 		if (this.time > 0) {
// 			this.time = this.time - 1;
// 		}
// 		this.setText(this.time);
// 	};

// 	this.secondUp = function() {
// 		this.time = this.time + 1;
// 		this.setText(this.time);
// 	};

// 	this.start = function() {
// 		if (!this.started) {
// 			this.startTime = this.time;
// 		}
// 		this.timeout = setTimeout(function() {
// 			makeVisible(this.name);
// 			makeActive(this.name);
// 			if (!this.started) {
// 				this.startTime = this.time;
// 				this.started = true;
// 				this.intervalID = setInterval(function() {
// 					this.timesRun++;
// 					if (this.timesRun >= this.startTime) {
// 						clearInterval(this.intervalID);
// 						$(getActiveBell()).get(0).play();
// 					}
// 					this.secondDown();
// 				}, 1000);
// 			}
// 			else {
// 				this.intervalID = setInterval(function() {
// 					this.timesRun++;
// 					if (this.timesRun >= this.startTime) {
// 						clearInterval(this.intervalID);
// 						$("#" + getActiveBell() + "-long-audio").get(0).play();
// 					}
// 					this.secondDown();
// 				}, 1000);
// 			}
// 		}, this.delay*1000);
// 	};

	// this.pause = function() {
	// 	clearInterval(this.intervalID);
	// 	clearTimeout(this.timeout);
	// 	$(getActiveBell()).get(0).pause();
	// }

	// this.stop = function() {
	// 	clearInterval(this.intervalID);
	// 	clearTimeout(this.timeout);
	// 	this.setTime(this.startTime);
	// 	this.setText();
	// 	this.started = false;
	// 	this.timesRun = 0;
	// 	$(getActiveBell()).get(0).pause();
	// 	$(getActiveBell()).get(0).currentTime = 0;
	// }

// 	this.isDone = function() {
// 		return this.time === 0;
// 	}

// 	this.setDelay = function(seconds) {
// 		this.delay = seconds;
// 	}

// 	this.startInterval = function() {
// 		this.timeout = setTimeout(function() {
// 			$(getActiveBellShort()).get(0).play();
// 		}, (this.time+this.delay)*1000)

// 	};



	// this.start = function() {
	// 	this.startTime = this.timeArray.join(":");
	// 	this.intervalId = setInterval(this.secondDown, 1000);
	// };

	// this.updateDisplay = function() {
	// 	this.timeText = this.timeArray.join(":");
	// 	$(this.bigDisplay).text(this.timeText);
	// 	$(this.smallDisplay).text(this.timeText);
	// }

	// this.stop = function() {
	// 	clearInterval(this.intervalId);
	// 	clearInterval(this.restartId);
	// 	$('#stop-button').addClass('hidden');
	// 	$('#pause-button').addClass('hidden');
	// 	$('#start-button').removeClass('hidden');
	// 	this.reset();
	// }

	// this.reset = function() {
	// 	this.setTime(this.startTime);
	// 	this.timeArray = (this.startTime).split(":");
	// }

	// this.restart = function() {
	//  	this.restartId = setInterval(this.secondDown, 1000);
	// }

	// this.pause = function() {
	// 	if (this.paused) {
	// 		clearInterval(this.restartId);
	// 		this.restart();
	// 		$('#pause-button').text('Pause');
	// 		this.paused = false;
	// 	}
	// 	else {
	// 		clearInterval(this.intervalId);
	// 		clearInterval(this.restartId);
	// 		$('#pause-button').text('Resume');
	// 		this.paused = true;
	// 	}
	// }

// }