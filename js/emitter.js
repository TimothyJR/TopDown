// emitter.js
// author: Tony Jefferson
// last modified: 3/12/2014
// dependencies: app.utilities

"use strict";
var app = app || {};

app.Emitter=function(){

	function Emitter(xPos, yPos){
		
		// public
		this.position = new app.Vector(xPos, yPos);
		this.numParticles = 10;
		this.useCircles = true;
		this.useSquares = false;
		this.xRange = 4;
		this.yRange = 4;
		this.minXspeed = -1;
		this.maxXspeed = 1;
		this.minYspeed = -3;
		this.maxYspeed = -5;
		this.startRadius = 6;
		this.expansionRate = 0.3
		this.decayRate = 2.5;
		this.lifetime = 100;
		this.red = 0;
		this.green = 0;
		this.blue = 0;
		
		// Used to disable the smoke cloud after a bit
		this.active = true;
		this.timer = 0;
		this.deathTime = 140;
		// private
		this._particles = undefined;
		
	};
	
	
	// "public" methods
	var p=Emitter.prototype;
	
	p.createParticles = function(emitterPoint){
		// CODE GOES HERE
		// initialize the particle array
		this._particles = [];
		
		// create exhaust particles
		for(var i=0; i < this.numParticles; i++)
		{
			var p = {};
			this._particles.push(initParticle(this, p, emitterPoint));
		}
		
		
		// log the particles
		//console.log(this._particles );
	};
	
	p.updateAndDraw = function(ctx){
			/* move and draw particles */
			// each frame, loop through particles array
			// move each particle down screen, and slightly left or right
			// make it bigger, and fade it out
			// increase its age so we know when to recycle it
			
			// CODE GOES HERE
			this.timer++;
			if(this.timer > this.deathTime)
			{
				this.active = false;
			}
			
			for(var i = 0; i < this._particles.length; i++)
			{
				var p = this._particles[i];
				
				p.age += this.decayRate;
				p.r += this.expansionRate;
				p.x += p.xSpeed;
				p.y += p.ySpeed;
				var alpha = 1 - p.age / this.lifetime;
				
				if(this.useSquare)
				{
					ctx.fillStyle = "rgba(" + this.red + "," + this.green + "," + this.blue +"," + alpha + ")";
					
					ctx.fillRect(p.x, p.y, p.r, p.r);
				}
				if(this.useCircles)
				{
					ctx.fillStyle = "rgba(" + this.red + "," + this.green + "," + this.blue +"," + alpha + ")";
					
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, Math.PI * 2, false);
					ctx.closePath();
					ctx.fill();
				}
				
				
				if(p.age>this.lifetime)
				{
					// Uncomment to keep the particles coming out
					//initParticle(this, p, {x:this.position.x, y:this.position.y});
				}
				
			
				
			}		
					
	} // end updateAndDraw()
			
			
			
	// "private" method
	function initParticle(obj, p, emitterPoint){
		
		// give it a random age when first created
		p.age = app.utilities.getRandomInt(0,obj.lifetime);
				
		// getRandom(min, max) from utilities.js
		p.x = emitterPoint.x + app.utilities.getRandom(-obj.xRange, obj.xRange);
		p.y = emitterPoint.y + app.utilities.getRandom(0, obj.yRange);
		p.r = app.utilities.getRandom(obj.startRadius/2, obj.startRadius); // radius
		p.xSpeed = app.utilities.getRandom(obj.minXspeed, obj.maxXspeed);
		p.ySpeed = app.utilities.getRandom(obj.minYspeed, obj.maxYspeed);
		return p;
	};
	
	
	
	return Emitter;
}();