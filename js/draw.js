// draw.js
// dependencies: none
"use strict";
var app = app || {};

app.draw = {
	// Clears part of the screen
   clear : function(ctx, x, y, w, h) {
		ctx.clearRect(x, y, w, h);
	},
	
	// Draws a rectangle
	rect : function(ctx, x, y, w, h, col) {
		ctx.fillStyle = col;
		ctx.fillRect(x, y, w, h);
	},
	
	// Draws a circle
	circle : function(ctx, x, y, r, col) {
		ctx.fillStyle = col;
		ctx.beginPath();
		ctx.arc(x + 5, y + 5, r, 0,  Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	},
	
	// Writes text
	text : function(ctx, string, x, y, size, col) {
		ctx.font = 'bold '+size+'px Monospace';
		ctx.fillStyle = col;
		ctx.fillText(string, x, y);
	},
	
	// Puts a gradient on the background
	// Used if there is no background image
	backgroundGradient: function(ctx, width, height){
		// Create gradient - top to bottom
		ctx.rect(0,0,width,height);
		var grd = ctx.createLinearGradient(0,0,0,height);
		grd.addColorStop(0,'#333333');
		grd.addColorStop(0.5, '#777777');
		grd.addColorStop(1, '#CCCCCC');
		
			
		// change this to fill entire ctx with gradient
		//ctx.fillStyle="purple";
		//ctx.fillRect(0,0,width,height);
		ctx.fillStyle = grd;
		ctx.fill();
	},
	
	// Draws a line
	line : function(ctx, point1, point2, width, col){
		ctx.strokeStyle = col;
		ctx.beginPath();
		ctx.moveTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.lineWidth = width;
		ctx.closePath();
		ctx.stroke();
	}
			
};
