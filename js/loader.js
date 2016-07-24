/*
loader.js
variable app is in global scope - i.e. a property of window.
app is our single global object literal
*/
"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// CONSTANTS
// Use w-a-s-d
app.KEYBOARD = {
	"KEY_LEFT": 65, 
	"KEY_UP": 87, 
	"KEY_RIGHT": 68, 
	"KEY_DOWN": 83,
	"KEY_SPACE": 32
};

// Load in images
app.IMAGES = {
	player: "images/Player.png",
	enemy: "images/Enemy.png",
	background: "images/Background.png"
};


// properties of app that will be accessed by the topDown.js module
app.animationID = undefined;
app.paused = false;

// app.keydown array to keep track of which keys are down
// this is called a "key daemon"
// topDown.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
app.keydown = [];


// the Modernizr object is from the modernizr.custom.js file
Modernizr.load(
	{ 
		// load all of these files
		load : [
			'js/topDown.js',
			'js/utilities.js',
			'js/player.js',
			'js/enemy.js',
			'js/bullet.js',
			'js/draw.js',
			'js/emitter.js',
			'js/vector.js',
			'js/enemy.js',
			'js/shop.js',
			app.IMAGES['player'],
			app.IMAGES['enemy'],
			app.IMAGES['background']
		],
		
		// when the loading is complete, this function will be called
		complete: function(){
			
			// set up event handlers
			window.onblur = function(){
				app.paused = true;
				cancelAnimationFrame(app.animationID);
				app.keydown = []; // clear key daemon
				
				createjs.Sound.stop();
				// call update() so that our paused screen gets drawn
				app.topDown.update();
			};
			
			window.onfocus = function(){
				app.paused = false;
				cancelAnimationFrame(app.animationID);
				
				app.topDown.startSoundtrack();
				// start the animation back up
				app.topDown.update();
			};
			
			// event listeners
			window.addEventListener("keydown",function(e){
				//console.log("keydown=" + e.keyCode);
				app.keydown[e.keyCode] = true;
			});
				
			window.addEventListener("keyup",function(e){
				//console.log("keyup=" + e.keyCode);
				app.keydown[e.keyCode] = false;
			});
			
			//Load sounds
			createjs.Sound.alternateExtensions = ["mp3"];
			// gun2.mp3 - BlastWaveFx - Soundbible.com - Modified by Bryce Lockwood
			createjs.Sound.registerSound({id:"bullet", src:"sounds/gun2.ogg"});
			// backgroundMusic.mp3 - Decrease Superior Technician - www.nosoapradio.us
			createjs.Sound.registerSound({id:"background", src:"sounds/backgroundMusic.ogg"});
			
			createjs.Sound.addEventListener("fileload", handleFileLoad);
			
			function handleFileLoad(e){
				if(e.src == "sounds/backgroundMusic.ogg")
				{
					app.topDown.startSoundtrack();
				}
			}
			
			// start game
			app.topDown.init();
		} // end complete
		
	} // end object
); // end Modernizr.load
