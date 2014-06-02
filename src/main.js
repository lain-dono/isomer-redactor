console.log('start');

window.commands = require('./commands');
var Redactor = require('./redactor');
var Map = require('./map');

var w = window.innerWidth,
	h = window.innerHeight,
	stage = new PIXI.Stage(0xCC0000, true),
	renderer = PIXI.autoDetectRenderer(w, h);
document.body.appendChild(renderer.view);

var iso = new Isomer(renderer.view);
iso.canvas = new PIXI.Graphics();
stage.addChild(iso.canvas);

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
	w = window.innerWidth;
	h = window.innerHeight;
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
redactor.run(new commands.Delete(2));
redactor.undo(1);
redactor.run(new commands.ResizePrism(1, [1,3,1]));
redactor.run(new commands.RotateZ(1, [1/2,3/2,1/2], Math.PI/8));

requestAnimFrame(animate);

function animate() {
	iso.canvas.clear();
	redactor.map.render();

	renderer.render(stage);
	requestAnimFrame(animate);
}
