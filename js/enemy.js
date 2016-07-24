"use strict";

app.Enemy = function(){
	// Set up everything for the enemy
	function Enemy(image, xPos, yPos, player){
		this.active = true;
		this.age = Math.floor(Math.random() * 128);
		
		this.color = "#A2B";
		this.position = new app.Vector(xPos, yPos);
		this.velocity = new app.Vector(0,0);
		this.acceleration = new app.Vector(0,0);
		
		this.image = image;
		this.width = 40;
		this.height = 40;
		this.radius = (this.width / 2 + this.height / 2) / 2
		this.damage = 10;
		
		this.MAXSPEED = 95;
		this.FRICTION = 60;
		this.player = player;
	};
	
	var p = Enemy.prototype;
	
	// Draw the enemy
	p.draw = function(ctx){
		var halfW = this.width / 2;
		var halfH = this.height / 2;
		//console.log(this.position);
		var vec = this.player.position.subtract(this.position);
		var angle;
		
		if(vec.y >= 0)
		{
			angle = vec.angle();
		}
		else
		{
			angle = -vec.angle();
		}
		
		ctx.save();
		// Translate and rotate the enemy
		ctx.translate(this.position.x, this.position.y);
		ctx.rotate(angle);
		
		if(!this.image){
			app.draw.rect(ctx, -halfW, -halfH, this.width, this.height, this.color);		
		}
		else
		{
			ctx.drawImage(this.image, -halfW, -halfH, this.width, this.height)
		}
		ctx.restore();
	};
	
	// Move the enemy
	p.update = function(dt) {
		
		// Move towards the player
		var desiredVector = this.player.position.subtract(this.position);
		desiredVector = desiredVector.normalize();
		desiredVector = desiredVector.scalarMult(this.MAXSPEED);
		desiredVector = desiredVector.subtract(this.velocity);
		
		this.acceleration = this.acceleration.add(desiredVector);
		// Move the enemy
		this.velocity = this.velocity.add(this.acceleration);
		this.velocity = this.velocity.clamp(this.MAXSPEED);
		var vel = this.velocity.scalarMult(dt);
		this.position = this.position.add(vel);
		this.velocity = this.velocity.scalarMult(1/this.FRICTION);
		this.acceleration = this.acceleration.reset();
	};
	
	// Sets the enemy to be removed from the array
	p.explode = function(){
		
		this.active = false;
	};
	
	
	
	return Enemy;
}();