document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {
	isLoading: false,
	pause: 1,
  	pauseText: document.getElementById('pause'),
  	playText: document.getElementById('play'),
  	sleepText: document.getElementById('sleepText'),
  	waitText: document.getElementById('waitText'),
  	less: document.getElementById('less'),
  	more: document.getElementById('more'),
  	sleepInterval: null,
  	playInterval: null,
  	sleep: 0,
  	audio: new Audio(),
  	isLoad: false,

  	init: function() {

		app.audio.mozAudioChannelType = 'content'; //audio bg play
		//app.audio.type = 'audio/mpeg';

        app.audio.src = 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm';
		app.audio.preload = 'auto';
		app.audio.onloadeddata = function() {
			app.isLoad = true;
		}

    	app.playText.addEventListener('click', app.audiopausetoggle);
    	app.pauseText.addEventListener('click', app.pauseStream);    	
    	app.less.addEventListener('click', app.lessSleep);    	
    	app.more.addEventListener('click', app.moreSleep);    	
		
	    if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
    	}
  	},

	lessSleep: function() {	
		app.sleep = app.sleep - 5;

		if (app.sleep < 0) {
			app.sleep = 0;
		}
		app.setSleepTimer();
	},

	moreSleep: function() {	
		app.sleep = app.sleep + 5;
			
		if (app.sleep > 30) {
			app.sleep = 30;
		}
		app.setSleepTimer();
	},
	
	setSleepTimer: function() {		
		if (app.sleepInterval != null) {
			clearTimeout(app.sleepInterval);
		}	
		app.sleepText.innerText = app.sleep == 0 ? "Disabled" : app.sleep;
		if (app.sleep > 0) {
			app.sleepInterval = setTimeout(function(){ 
				app.pauseStream(); 				
				app.sleep = 0;
				app.sleepText.innerText = "Disabled";
				clearTimeout(app.sleepInterval);
				},
			  app.sleep * 60000); // 5000); // for test only 5 second not 1 minute
		}
	},

	showPlay: function() {
		app.waitText.classList.add('hide');
		app.pauseText.classList.remove('hide');
	},

	checkPlay: function() {
		app.isLoading = true;
		if (app.isLoad) { 
			app.showPlay(); 
			clearInterval(app.playInterval); 
			app.isLoading = false;
		}
	},

	audiopausetoggle: function() {
		if(app.pause == 1) {			
			app.setSleepTimer();
    		app.pause = 0;
        	app.audio.play();

			app.playText.classList.add("hide");
			if (app.isLoad) {
				app.showPlay();
			} else {
				app.waitText.classList.remove('hide');
				app.playInterval = setInterval( app.checkPlay, 1000);
			}
    	} else {
    		app.pauseStream();
    	}
	},

	pauseStream: function() {
		app.pause = 1;
    	app.audio.pause();
		app.playText.classList.remove("hide");
		app.pauseText.classList.add('hide');
	},

};