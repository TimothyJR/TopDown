// vector.js
// dependencies: none

"use strict";
var app = app || {};

app.Vector = function(){

	function Vector(xPos,yPos){
		// ivars - unique for every instance
		this.x = xPos;
		this.y = yPos;
	}; // end Vector Constructor
	
	
	var p = Vector.prototype;
	
	// Addition function
	p.add = function(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	};

	// Subtraction function
	p.subtract = function(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};
	
	// Scalar multiplication
	p.scalarMult = function(number) {
		return new Vector(this.x * number, this.y * number);
	};
	
	// Dot product of two vectors
	p.dot = function(vector) {
		return (this.x * vector.x + this.y * vector.y);
	};
	
	// Gets the magnitude of the vector
	p.magnitude = function() {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};
	
	// Gets a normalized version of a vector
	p.normalize = function() {
		return new Vector(this.x / this.magnitude(),this.y / this.magnitude());
	};
	
	// Clamps a magnitude of a vector to a value
	p.clamp = function(clampValue) {
		if(this.magnitude() > clampValue)
		{
			var vec = this.normalize();
			return new Vector(vec.x * clampValue, vec.y * clampValue);
		}
		return this;
	};
	
	// Gets the distance between two vectors
	p.distance = function(vector) {
		return Math.sqrt(Math.pow(vector.y - this.y, 2) + pow(vector.x - this.x, 2));
	};

	// Gets the angle between two vectors
	p.angleBetween = function(vector) {
		return Math.acos(vector.dot(this) / (this.magnitude() * vector.magnitude()));
	};
	
	// Gets the angle from the x axis
	p.angle = function() {
		
		var vec = new Vector(1,0);
		return Math.acos(vec.dot(this) / (this.magnitude()));
	};
	
	// Reset a vector
	p.reset = function(){
		return new Vector(0,0);
	};
	
	return Vector; 
}();
