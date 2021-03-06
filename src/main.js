"use strict";

console.log('start');

window.Isomer = require('isomer');

window.commands = require('./commands');
var Redactor = require('./redactor');
var Map = require('./map');

var w = $('#canvas').width(),
	h = $('#canvas').height(),
	stage = new PIXI.Stage(0xFFFFFF, true),
	renderer = PIXI.autoDetectRenderer(w, h);

$('#canvas').append(renderer.view);

window.iso = new Isomer(renderer.view);
iso.canvas = new PIXI.Graphics();
stage.addChild(iso.canvas);

iso.canvas.path_line = function (points) {
	this.moveTo(points[0].x, points[0].y);

	for (var i = 1; i < points.length; i++) {
		this.lineTo(points[i].x, points[i].y);
	}

	this.lineTo(points[0].x, points[0].y);
}

iso.canvas.path = function (points, color) {
	var c = color.r * 256 * 256 + color.g * 256 + color.b;
	this.beginFill(c, color.a);
	this.moveTo(points[0].x, points[0].y);

	for (var i = 1; i < points.length; i++) {
		this.lineTo(points[i].x, points[i].y);
	}

	this.endFill();
}

window.onresize = resize;
resize();
function resize() {
	w = $('#canvas').width();
	h = $('#canvas').height();

	renderer.resize(w, h);
	iso.canvas.width = w;
	iso.canvas.height = h;
	iso.originX = w / 2;
	iso.originY = h * 0.9;
}

window.redactor = new Redactor(new Map(iso));

redactor.run(new commands.AddPrism([ 1, 0, 0], [4,4,2]));
redactor.run(new commands.AddPrism([ 0, 0, 0], [1,4,1]));
redactor.run(new commands.AddPrism([-1, 1, 0], [1,2,1]));

redactor.run(new commands.AddPyramid([2, 3, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [180,180,0,0]));
redactor.run(new commands.Modificator(redactor.map.objects.length-1, {type: 'scale', point:[2,4,3], x:0.5}));

redactor.run(new commands.AddPyramid([4, 3, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [180,0,180,0]));
redactor.run(new commands.Modificator(redactor.map.objects.length-1, {type: 'scale', point:[5,4,3], x:0.5}));

redactor.run(new commands.AddPyramid([4, 1, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [0,180,0,0]));
redactor.run(new commands.Modificator(redactor.map.objects.length-1, {type: 'scale', point:[5,1,3], x:0.5}));

redactor.run(new commands.AddPyramid([2, 1, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [40,180,40,0]));
redactor.run(new commands.Modificator(redactor.map.objects.length-1, {type: 'scale', point:[2,1,3], x:0.5}));

redactor.run(new commands.Delete(2));
redactor.run(new commands.Resize(1, [1,3,1]));
redactor.run(new commands.Modificator(1, {type: 'rotateZ', point:[1/2,3/2,1/2], yaw:Math.PI/8}));

redactor.run(new commands.AddCylinder([0, 2, 0], [1,30,2]));

redactor.run(new commands.AddPrism([0,0,0], [3,3,1]));
redactor.run(new commands.AddPath([
  [1, 1, 1],
  [2, 1, 1],
  [2, 2, 1],
  [1, 2, 1],
], [50, 160, 60, 0]));

redactor.run(new commands.AddShape([
  [1, 1, 1],
  [2, 1, 1],
  [2, 3, 1],
], 0.3, [50, 160, 60, 0]));


requestAnimFrame(animate);

function animate() {
	redactor.render();

	renderer.render(stage);
	requestAnimFrame(animate);
}
