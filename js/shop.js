"use strict";
var app = app || {};

app.shop = {
	bulletSpread: 
	{
		purchased: 0,
		cost: 200,
		max: 1,
		text: "Bullet Spread"
	},
	fireSpeed: 
	{
		purchased: 0,
		cost: 50,
		max: 4,
		text: "Fire Speed Increase"
	},
	movementSpeed:
	{
		purchased: 0,
		cost: 12,
		max: 3,
		text: "Movement Speed Increase"
	},

	player: undefined,
	returnToGame: false,
	width: 0,
	height: 0,
	items: [],
	rects: [],
	
	// Set up the shop
	init: function(player, width, height)
	{
		this.player = player;
		this.width = width;
		this.height = height;
		
		// Add all items to the shop
		this.addItemToShop(this.bulletSpread);
		this.addItemToShop(this.fireSpeed);
		this.addItemToShop(this.movementSpeed);
		this.rects.push({ x:this.width / 2 - 45, y:65 + (70 * this.items.length), width:140, height:30 });
	},
	
	// Update
	update: function(mousePosition)
	{
	
	},
	
	// Takes care of all drawing when the game state is in shop
	drawShopScreen : function(ctx, score) {
		// Draw a rectangle over the background
		app.draw.rect(ctx, 15, 15, this.width - 30, this.height - 30, "white");
		app.draw.rect(ctx, 20, 20, this.width - 40, this.height - 40, "black");
		
		// Draw text to signify that we are in the shop screen
		app.draw.text(ctx, "Shop", this.width/2 - 20, 50, 30, "white");
		// Display the points that can be spent
		app.draw.text(ctx, "Money: " + score, this.width - 100, 50, 15, "white");
		
		// Draw the item text and buttons
		this.drawItemText(ctx);
		app.draw.rect(ctx, this.width / 2 - 50, 60 + (70 * this.items.length), 150, 40, "white");
		app.draw.rect(ctx, this.width / 2 - 45, 65 + (70 * this.items.length), 140, 30, "black");
		app.draw.text(ctx, "Return To Game", this.width / 2 - 40, 80 + (70 * this.items.length), 15, "white");
	},
	
	// Draws the items name, how many are bought, the cost, and a button for purchase
	drawItemText : function(ctx) {
		for(var i = 0; i < this.items.length; i++)
		{
			app.draw.text(ctx, this.items[i].text, 30, 80 + (70 * i), 15, "white");
			app.draw.text(ctx, this.items[i].purchased, 300, 80 + (70 * i), 15, "white");
			app.draw.text(ctx, this.items[i].cost, 450, 80 + (70 * i), 15, "white");
			if(this.items[i].purchased >= this.items[i].max)
			{
				app.draw.text(ctx, "Purchased", this.width - 200, 80 + (70 * i), 15, "white");
			}
			else
			{
				app.draw.rect(ctx, this.rects[i].x - 5, this.rects[i].y - 5, this.rects[i].width + 10, this.rects[i].height + 10, "white");
				app.draw.rect(ctx, this.rects[i].x, this.rects[i].y, this.rects[i].width, this.rects[i].height, "black");
				app.draw.text(ctx, "Click To Buy", this.width - 200, 80 + (70 * i), 15, "white");
			}
		}
		
	},
	
	// Adds an item to the shop. Adds a rectangle that will be used for button presses
	addItemToShop : function(item) {
		this.items.push(item);
		
		var rect = { x:this.width - 220, y:60 + (70 * (this.items.length - 1)), width:150, height:30 };
		
		this.rects.push(rect);
	},
	
	// Checks to see if buttons are clicked on
	// If they are, check to see if the player can buy the item
	// Or return to the game
	checkButtonClicked : function(x, y, score) {
		
		for (var i = 0; i < this.rects.length; i++) {
			// Check for x constraints
			if(x > this.rects[i].x && x < this.rects[i].x + this.rects[i].width)
			{
				// Check for y constraints
				if(y > this.rects[i].y && y < this.rects[i].y + this.rects[i].height)
				{
					// Clicked on the return to game button
					if(i == (this.rects.length - 1))
					{
						this.returnToGame = true;
						return score;
					}
					else
					{
						// Check to see if you can afford
						if(score >= this.items[i].cost)
						{
							score -= this.items[i].cost;
							this.items[i].purchased++;
							if(this.items[i].purchased >= this.items[i].max)
							{
								this.items[i].cost = ' ';
							}
							else
							{
								this.items[i].cost = this.items[i].cost * 2;
							}
							return score;
						}
					}
				}
			}
			
		}
		
		return score;
	},
};