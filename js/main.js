document.addEventListener('DOMContentLoaded', function () {
  	app.init();
});

var app = {
	isPressCenter: false,
	isLoading: false,
	pause: 1,
  	infoDiv: document.getElementById('info'),
  	pauseText: document.getElementById('pause'),
  	playText: document.getElementById('play'),
  	sleepText: document.getElementById('sleepText'),
  	waitText: document.getElementById('waitText'),
  	close: document.getElementById('close'),
  	sleepInterval: null,
  	playInterval: null,
  	sleep: 0,
  	audio: new Audio(),
  	isLoad: false,

  	init: function() {
    	document.addEventListener('keypress', (e) => {
			app.manejarTeclado(e);
		});

		app.audio.mozAudioChannelType = 'content'; //audio bg play
		//app.audio.type = 'audio/mpeg';

        app.audio.src = 'https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm';
		app.audio.preload = 'auto';
		app.audio.onloadeddata = function() {
			app.isLoad = true;
		}

    	app.playText.addEventListener('click', app.audiopausetoggle);
    	app.pauseText.addEventListener('click', app.pauseStream);    	

		/*
	    if ('serviceWorker' in navigator) {
      		navigator.serviceWorker
        		.register('service-worker.js')
        		.then(function() {
          		//console.log('Service Worker Registered');
        	});
    	}
    	*/
  	},

	manejarTeclado: function(e) {

    	if ((e.key == "MicrophoneToggle" || e.key == "Enter") && !app.isLoading) {
    		if (!app.isPressCenter) {
    			app.isPressCenter = true;
	        	app.audiopausetoggle();
	    	}
	        window.setTimeout(function() { app.isPressCenter = false; }, 500);
	    }
		else if (e.key == "ArrowLeft") { 
			app.sleep = app.sleep - 5;

			if (app.sleep < 0) {
				app.sleep = 0;
			}
			app.setSleepTimer();
		}
		else if (e.key == "ArrowRight") {
			app.sleep = app.sleep + 5;
			
			if (app.sleep > 30) {
				app.sleep = 30;
			}
			app.setSleepTimer();
		}		
		else if (e.key == "SoftLeft") {
			if (confirm("Close the app?") == true) {
				window.close();
			}
		}
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
		app.infoDiv.classList.add("play");
		app.infoDiv.classList.remove("pause");
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
			app.pauseText.classList.remove('hide');
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
		app.infoDiv.classList.add("pause");
		app.infoDiv.classList.remove("play");
	},

};