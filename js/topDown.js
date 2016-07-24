"use strict";

var app = app || {};

app.topDown = {
	WIDTH: 800,
	HEIGHT: 452,
	BEG_FIRE_RATE: 3,
	
	ENEMY_WAVE_INC: 2,
	// Used to change from menu to game and other windows
	GAME_STATE_MENU : 1,
	GAME_STATE_GAME : 2,
	GAME_STATE_DEAD : 3,
	GAME_STATE_SHOP : 4,
	
	// Debug allows for:
	// Enemies to be seen
	DEBUG: false,
	currentGameState : 1,
	// Keep the score of enemies killed
	score : 0,
	mouseData: { x: 0, y:0 },
	// Enemies
	enemies : [],
	enemySpawnRate : 1,
	maxEnemies: 15,
	enemyImage: undefined,
	
	waveAmount: 12,
	enemyKills: 0,
	currentWave: 1,
	// How many enemies does it take for the 
	// spawn rate to increase
	//enemySpawnIncrement : 50,
	
	player: undefined,
	playerBullets : [],
	fire_rate: 3,
	cooldown: 0,
	
	// Background
	backgroundImage: undefined,
	// Emitters
	emitters: [],
	
	//Shop
	shop : undefined,
	canvas : undefined,
	ctx : undefined,
	dt : 1/60.0,
	
	// Sets up the game
	init : function() {
		// Set up the canvas
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		
		this.canvas.onmousedown = this.doMousedown.bind(this);
		this.canvas.onmousemove = this.doMouseMove.bind(this);
		this.ctx = this.canvas.getContext('2d');
		
		// Get the player
		this.player = app.player;
		this.player.init();
		var image = new Image();
		image.src = app.IMAGES['player'];
		this.player.image = image;
		
		var image = new Image();
		image.src = app.IMAGES['enemy'];
		this.enemyImage = image;
		
		var image = new Image();
		image.src = app.IMAGES['background'];
		this.backgroundImage = image;
		this.shop = app.shop;
		this.shop.init(this.player, this.WIDTH, this.HEIGHT);
		this.update();
	},
	
	// Called every frame
	// Handles game logic
	update : function(){
		app.draw.clear(this.ctx,0,0,this.WIDTH,this.HEIGHT);
		
		// Pausing the game
		if(app.paused)
		{
			this.drawPauseScreen(this.ctx);
			return;
		}
		
		// Update the game
		// Main menu screen
		if(this.currentGameState == this.GAME_STATE_MENU)
		{
			this.drawMainScreen(this.ctx);
		}
		// Game Screen
		else if(this.currentGameState == this.GAME_STATE_GAME)
		{
			this.player.update(this.dt);
			this.moveSprites();
			
			// Check collisions
			this.checkForCollisions();
			
			if(!this.backgroundImage)
			{
				app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
			}
			else
			{
				this.drawBackground(this.ctx, this.backgroundImage);
			}
			
			// Draw sprites
			
			this.ctx.globalAlpha = 0.9;
			this.drawSprites();
			
			
			// Draw HUD
			this.ctx.globalAlpha = 1.0;
			this.drawHUD();
			
			if(this.player.health == 0)
			{
				this.currentGameState = this.GAME_STATE_DEAD;
			}
			else if(this.enemyKills == this.waveAmount)
			{
				this.currentWave++;
				this.currentGameState = this.GAME_STATE_SHOP;
			}
		}
		// Game Over Screen
		else if(this.currentGameState == this.GAME_STATE_DEAD)
		{
			this.drawGameOverScreen(this.ctx);
		}
		else if(this.currentGameState == this.GAME_STATE_SHOP)
		{
			if(!this.backgroundImage)
			{
				app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
			}
			else
			{
				this.drawBackground(this.ctx, this.backgroundImage);
			}
			
			this.shop.drawShopScreen(this.ctx, this.score);
			if(this.shop.returnToGame)
			{
				this.waveAmount = this.ENEMY_WAVE_INC * this.waveAmount;
				this.enemyKills = 0;
				this.shop.returnToGame = false;
				this.player.setSpeed(this.shop.movementSpeed.purchased);
				this.fire_rate = this.BEG_FIRE_RATE + (0.05 * this.shop.fireSpeed.purchased);
				this.enemySpawnRate+= 0.2;
				this.player.health = 100;
				this.currentGameState = this.GAME_STATE_GAME;
			}
		}
		
		// Loop the game
		app.animationID = requestAnimationFrame(this.update.bind(this));
	},
	
	// Lets the player know the game is paused
	drawPauseScreen : function(ctx){
		ctx.save();
		if(!this.backgroundImage)
		{
			app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		}
		else
		{
			this.drawBackground(this.ctx, this.backgroundImage);
		}
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "... PAUSED ...", this.WIDTH/2, this.HEIGHT/2, 60, "white");
		ctx.restore();
	},
	
	// Says the title of the game
	// Tells the player how to get into the game
	// Tells the player who made the game
	// Gives instructions on how to play
	drawMainScreen : function(ctx){
		ctx.save();
		if(!this.backgroundImage)
		{
			app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		}
		else
		{
			this.drawBackground(this.ctx, this.backgroundImage);
		}
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "TopDown", this.WIDTH/2, this.HEIGHT/2 - 150, 60, "white");
		app.draw.text(this.ctx, "Click to play", this.WIDTH/2, this.HEIGHT/2 - 75, 30, "white");
		app.draw.text(this.ctx, "Made by Timothy Reuter", this.WIDTH/2, this.HEIGHT/2 - 25, 30, "white");
		app.draw.text(this.ctx, "Controls", this.WIDTH/2, this.HEIGHT/2 + 50, 30, "white");
		app.draw.text(this.ctx, "A - Move Left", this.WIDTH/2 - 125, this.HEIGHT/2 + 100, 20, "white");
		app.draw.text(this.ctx, "D - Move Right", this.WIDTH/2 + 125, this.HEIGHT/2 + 100, 20, "white");
		app.draw.text(this.ctx, "W - Move Up", this.WIDTH/2 - 125, this.HEIGHT/2 + 125, 20, "white");
		app.draw.text(this.ctx, "S - Move Down", this.WIDTH/2 + 125, this.HEIGHT/2 + 125, 20, "white");
		app.draw.text(this.ctx, "left click - Shoot", this.WIDTH/2, this.HEIGHT/2 + 150, 20, "white");
		ctx.restore();
	},
	

	
	// Gives a player the indication of health and their score
	drawHUD : function(){
		// Draw player health to the screen
		app.draw.text(this.ctx, "Health: " + this.player.health, 20, 40, 16, "#ddd");
	
		// Draw score to the screen
		app.draw.text(this.ctx, "Money: " + this.score, this.WIDTH - 120, 40, 16, "#ddd");
		
	},
	
	// Tells the player their score and that the game is over
	// Also gives instructions to get back to the main menu
	drawGameOverScreen: function(ctx){
		ctx.save();
		if(!this.backgroundImage)
		{
			app.draw.backgroundGradient(this.ctx,this.WIDTH,this.HEIGHT);
		}
		else
		{
			this.drawBackground(this.ctx, this.backgroundImage);
		}
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		app.draw.text(this.ctx, "Game Over", this.WIDTH/2, this.HEIGHT/2 - 100, 40, "white");
		app.draw.text(this.ctx, "You got to wave " + app.topDown.currentWave, this.WIDTH/2, this.HEIGHT/2 - 50, 40, "white");
		app.draw.text(this.ctx, "Click to go to Main Menu", this.WIDTH/2, this.HEIGHT/2, 20, "white");
		ctx.restore();
	},
	
	// Draws the background image
	drawBackground: function(ctx, image){
		ctx.drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
	},
	
	// Takes care of all the drawing
	drawSprites : function(){
	
		// Draw enemies
		for(var i = 0; i < this.enemies.length; i++)
		{
			this.enemies[i].draw(this.ctx);
		}
		
		// Draw emitters
		for(var i = 0; i < this.emitters.length; i++)
		{
			this.emitters[i].updateAndDraw(this.ctx);
		}
		
		// Draw bullets
		for(var i = 0; i < this.playerBullets.length; i++)
		{
			this.playerBullets[i].draw(this.ctx);
		}
		
		// Draw the player
		this.player.draw(this.ctx, this.mouseData);
		
		
		
	},
	
	// Takes care of movement and updating
	moveSprites : function(){
		// Move player
		this.movePlayer();
		

		// Enemies
		// Spawn enemies
		this.spawnEnemies();
		
		for(var i = 0; i < this.enemies.length; i++)
		{
			this.enemies[i].update(this.dt);
		}
		
		this.enemies = this.enemies.filter(function(enemy){
			return enemy.active;
		});
		
		// Bullets
		// Shoot Bullets
		this.cooldown --;
		if(this.cooldown <= 0 && app.keydown[app.KEYBOARD.KEY_SPACE])
		{	
			this.shoot(this.player.position.x, this.player.position.y);
		}
		
		// Move bullets
		for(var i = 0; i < this.playerBullets.length; i++)
		{
			this.playerBullets[i].update(this.dt);
		}
		
		this.playerBullets = this.playerBullets.filter(function(bullet) {
			return bullet.active;
		});
		
		// Emitters
		this.emitters = this.emitters.filter(function(emitter) {
			return emitter.active;
		});
	},
	
	// Triggered when the player clicks the mouse
	doMousedown : function (e){	
		// If in the menu screen, change to the game screen
		if(this.currentGameState == this.GAME_STATE_MENU)
		{
			this.currentGameState = this.GAME_STATE_GAME;
		}
		// If in the game screen, shoot a bullet
		else if(this.currentGameState == this.GAME_STATE_GAME)
		{
			if(this.cooldown <= 0)
			{
				this.shoot(this.player.position.x, this.player.position.y);
			}
				
		}
		// If in the game over screen, reset the game and go to the menu
		else if(this.currentGameState == this.GAME_STATE_DEAD)
		{
			this.score = 0;
			this.player.health = 100;
			this.enemies = [];
			this.waveAmount = 15;
			this.currentWave = 1;
			this.enemyKills = 0;
			this.currentGameState = app.topDown.GAME_STATE_MENU;
		}
		// Check for button clicks in the shop menu
		else if(this.currentGameState == this.GAME_STATE_SHOP)
		{
			this.score = this.shop.checkButtonClicked(this.mouseData.x, this.mouseData.y, this.score);
		}
	},
	
	// Triggered when the player moves the mouse
	// Sets mouse data for later use
	doMouseMove: function(e){
		this.mouseData = app.utilities.getMouse(e);
	},
	
	// Takes care of player movement on key press
	// Also keeps the player on screen
	movePlayer: function(){
		if(app.keydown[app.KEYBOARD.KEY_LEFT])
		{
			this.player.moveLeft(this.dt);
		}
		if(app.keydown[app.KEYBOARD.KEY_RIGHT])
		{
			this.player.moveRight(this.dt);
		}
		if(app.keydown[app.KEYBOARD.KEY_UP])
		{
			this.player.moveUp(this.dt);
		}
		if(app.keydown[app.KEYBOARD.KEY_DOWN])
		{
			this.player.moveDown(this.dt);
		}
		
		this.player.keepOnScreen(this.WIDTH, this.HEIGHT);
	},
	
	// Shoots a bullet in the direction that the laser points
	shoot : function(x,y){
		// Get the direction of the velocity
		var velocityDir = new app.Vector(this.mouseData.x, this.mouseData.y);
		velocityDir = velocityDir.subtract(this.player.position);
		
		// Create the bullet
		this.playerBullets.push(new app.Bullet(x, y, velocityDir));
		
		if(this.shop.bulletSpread.purchased == 1)
		{
			var bulletAngle = velocityDir.angle();
			var bulletMag = velocityDir.magnitude();
			console.log(bulletAngle);
			// Get the vectors for the new bullets
			var bulletTwoVec = new app.Vector(bulletMag * Math.cos(bulletAngle + Math.PI / 6), bulletMag * Math.sin(bulletAngle + Math.PI / 6));
			var bulletThreeVec = new app.Vector(bulletMag * Math.cos(bulletAngle - Math.PI / 6), bulletMag * Math.sin(bulletAngle - Math.PI / 6));
			
			// Create the bullets
			this.playerBullets.push(new app.Bullet(x, y, bulletTwoVec));
			this.playerBullets.push(new app.Bullet(x, y, bulletThreeVec));
		}
		
		// Set cooldown for the bullet
		this.cooldown = 60/this.fire_rate;
		createjs.Sound.play("bullet", {volume: 0.3});
	},
		
	// Checks for multiple types of collisions
	// Bullets and enemies --- If they collide, create an emitter for a death affect
	// Enemies and player --- Decrement the player's health
	checkForCollisions : function() {	
		var self =  this;
		// Bullets and Enemies
		this.playerBullets.forEach(function(bullet) {
			self.enemies.forEach(function(enemy) {
				if(self.collides(bullet,enemy))
				{
					// Remove bullet
					bullet.active = false;
					
					// Add score
					self.score++;
					
					// Get rid of enemy
					enemy.explode();
					
					// Create an emitter on enemy death
					var deathEmitter = new app.Emitter(enemy.position.x, enemy.position.y);
					deathEmitter.red = 0;
					deathEmitter.blue = 100;
					deathEmitter.green = 0;
					deathEmitter.lifeTime = 500;
					deathEmitter.expansionrate = 0.5;
					deathEmitter.numParticles = 50;
					deathEmitter.xRange = 1;
					deathEmitter.yRange = 2;
					deathEmitter.useCircles = true;
					deathEmitter.useSquareds = false;
					
					deathEmitter.createParticles({x:enemy.position.x, y:enemy.position.y});
					// Since enemy died, lower wave count
					self.enemyKills++;
					self.emitters.push(deathEmitter);
				}
			});
		});
		// Enemies and Player
		this.enemies.forEach(function(enemy){
			if(self.collides(enemy, self.player))
			{
				enemy.explode();
				var hurtEmitter = new app.Emitter(self.player.position.x, self.player.position.y);
				hurtEmitter.red = 100;
				hurtEmitter.blue = 0;
				hurtEmitter.green = 0;
				hurtEmitter.lifetime = 100;
				hurtEmitter.expansionrate = 0.2;
				hurtEmitter.numParticles = 25;
				hurtEmitter.startRadius = 2;
				hurtEmitter.xRange = 2;
				hurtEmitter.yRange = 1;
				hurtEmitter.minXspeed = -2;
				hurtEmitter.maxXspeed = 2;
				hurtEmitter.minYspeed = -1;
				hurtEmitter.maxYspeed = 1;
				hurtEmitter.useCircles = true;
				hurtEmitter.useSquares = false;
				
				hurtEmitter.createParticles({x:self.player.position.x, y:self.player.position.y});
				
				self.emitters.push(hurtEmitter);
				self.player.health -= enemy.damage;
				// Since enemy died, lower wave count
				self.enemyKills++;
				if(self.player.health < 0)
				{
					self.player.health = 0;
				}
			}
		});
		
		
	},
	
	// Determines whether two things collide or not
	collides: function (a, b) {
		var distance = a.position.subtract(b.position);
		if(distance.magnitude() < (a.radius + b.radius))
		{
			return true;
		}
		return false;
	},
	
	// In charge of spawning enemies
	spawnEnemies: function(){
		// Can more enemies be spawned this wave
		if(this.enemyKills + this.enemies.length < this.waveAmount)
		{
			// Randomly spawn enemies based on a spawn rate
			if(Math.random() < this.enemySpawnRate/60){
				var negate = 1;
				var random = Math.random();
				var spawn = {x:0, y:0};
				spawn = this.getSpawnX(random);
				
				var randomWidth = Math.floor(Math.random() * this.WIDTH + this.WIDTH * negate);
				if(this.DEBUG && this.enemies.length < this.maxEnemies)
				{
					this.enemies.push(new app.Enemy(this.enemyImage, spawn.x, spawn.y, this.player));
				}
				else if(!this.DEBUG)
				{
					this.enemies.push(new app.Enemy(this.enemyImage, spawn.x, spawn.y, this.player));	
				}				
				
			}
		}
	},
	
	// Determines the x coordinate of a spawn point
	getSpawnX: function(random){
		var randomWidth = 0;
		var randomHeight = 0;
		// Determines if the height of the spawn point is above, below, or at canvas level
		if(random >= 0.3 && random <= 0.6)
		{
			randomHeight = Math.floor(Math.random() * this.HEIGHT);
			randomWidth = this.getSpawnY(true);
		}
		else if(random < 0.3)
		{
			randomHeight = Math.floor(Math.random() * this.HEIGHT - this.HEIGHT);
			randomWidth = this.getSpawnY(false);
		}
		else if(random > 0.6)
		{
			randomHeight = Math.floor(Math.random() * this.HEIGHT + this.HEIGHT);
			randomWidth = this.getSpawnY(false);
		}
		return {x:randomWidth, y:randomHeight};
	},
	
	// Determines the y coordinate of a spawn point
	getSpawnY: function(onScreen)
	{
		var randomWidth = 0;
		// If the spawn height is off the screen, the width can be anywhere
		if(!onScreen)
		{
			var random = Math.random();
			if(random >= 0.3 && random <= 0.6)
			{
				randomWidth = Math.floor(Math.random() * this.WIDTH);
			}
			else if(random < 0.3)
			{
				randomWidth = Math.floor(Math.random() * this.WIDTH + this.WIDTH);
			}
			else if(random > 0.6)
			{
				randomWidth = Math.floor(Math.random() * this.WIDTH - this.WIDTH);
			}
		}
		else
		{
			// If the spawn height is not above or below canvas, place the width off the screen
			var random = Math.random();
			if(random >= 0.5)
			{
				randomWidth = Math.floor(Math.random() * this.WIDTH + this.WIDTH);
			}
			else
			{
				randomWidth = Math.floor(Math.random() * this.WIDTH - this.WIDTH);
			}
		}
		
		return randomWidth;
	},
	
	// Plays the background music
	startSoundtrack: function(){
		createjs.Sound.stop();
		createjs.Sound.play("background",{loop: -1, volume: 0.5});
	}
	
};