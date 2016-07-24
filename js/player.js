"use strict";
var app = app || {};

app.player = {
	color: "black",
	position: undefined,
	velocity: undefined,
	acceleration: undefined,
	width: 40,
	height: 40,
	radius: undefined,
	speed: 150,
	health: 100,
	image: undefined,
	
	MAXSPEED: 100,
	FRICTION: 60,
	
	// Sets up the player
	init: function(){
		this.position = new app.Vector(400,226);
		this.velocity = new app.Vector(0,0);
		this.acceleration = new app.Vector(0,0);
		this.radius = (this.height / 2 + this.width / 2 ) / 2;
	},
	
	// Updates the players position and other vectors
	update: function(dt){

		this.velocity = this.velocity.add(this.acceleration);
		this.velocity = this.velocity.clamp(this.MAXSPEED);
		var vel = this.velocity.scalarMult(dt);
		this.position = this.position.add(vel);
		this.velocity = this.velocity.scalarMult(1/this.FRICTION);
		this.acceleration = this.acceleration.reset();
	},
	
	// Draws the player
	draw: function(ctx, mouse){
		// Draw from the middle
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		
		// Create a vector from the mouse position
		var mouseVec = new app.Vector(mouse.x, mouse.y);
		// Create a vector that is the position subtracted from the mouse position
		var vec = mouseVec.subtract(this.position);
		// Get the angle to that vector
		var angle;
		if(vec.y >=0)
		{
			angle = vec.angle();
		}
		else
		{
			angle = -vec.angle();
		}
		ctx.save();
		
		// Translate and rotate the character
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(angle);
		if(!this.image)
		{
			app.draw.rect(ctx, -halfW, -halfH, this.width, this.height, this.color);
		}
		else
		{	
			ctx.drawImage(this.image, -halfW, -halfH, this.width, this.height)
		}
		
		ctx.restore();
	},
	
	// Moves the player to the left
	moveLeft: function(dt){
		this.acceleration.x -= this.speed;
	},
	
	// Moves the player to the right
	moveRight: function(dt){
		this.acceleration.x += this.speed;
	},
	
	// Moves the player up
	moveUp: function(dt){
		this.acceleration.y -= this.speed;
	},
	
	// Moves the player to the right
	moveDown: function(dt){
		this.acceleration.y += this.speed;
	},
	
	// Keeps the player from leaving the screen
	keepOnScreen: function(screenWidth, screenHeight)
	{
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		if(this.position.x - halfW < 0)
		{
			this.position.x = halfW;
		}
		else if(this.position.x + halfW > screenWidth)
		{
			this.position.x = screenWidth - halfW;
		}
		
		if(this.position.y - halfH < 0)
		{
			this.position.y = halfH;
		}
		else if(this.position.y + halfH > screenHeight)
		{
			this.position.y = screenHeight - halfH;
		}
	},
	
	// used to change the speed of the player(Purchasing the upgrade)
	setSpeed: function(number){
		this.MAXSPEED = 100 + (number * 20);
	}
};