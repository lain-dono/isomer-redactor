var lol = 55;

console.log('lol wut?', lol);

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


var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

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

function AddPrism(pos, size) {
	this.redo = function(map) {
		map.objects.push({type: "prism", pos: pos, size: size})
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function ResizePrism(id, size) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.size;
		obj.size = size;
	};
	this.undo = function(map) {
		var obj = map.objects[id];
		obj.size = old;
	};
}

function MovePrism(id, pos) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.pos;
		obj.pos = pos;
	};
	this.undo = function(map) {
		map.objects[id].pos.size = old;
	};
}

function Map() {
	this.objects = [
		/*{type: "prism", pos: [1, 0, 0], dx: 4, dy: 4, dz: 2},
		{type: "prism", pos: [0, 0, 0], dx: 1, dy: 4, dz: 1},
		{type: "prism", pos: [-1, 1, 0], dx: 1, dy: 3, dz: 1},
		*/
	];
	this.render = function(iso) {
		for (var i=0, l=this.objects.length; i<l; i++) {
			var obj = this.objects[i];
			switch(obj.type) {
			case "prism":
				var pos = obj.pos;
				var size = obj.size;
				iso.add(Shape.Prism(new Point(pos[0], pos[1], pos[2]), size[0], size[1], size[2]));
				break;
			default:
				console.warn("fail obj.type", obj)
			}
		}
	};
}

function Redactor() {
	this.commands = [];
	this.current = 0;
	this.map = new Map();

	this.run = function(command) {
		if (this.current < this.commands.length-1) {
			this.commands.splice(this.current);
		}
		command.redo(this.map);
		this.commands.push(command);
		this.current++;
	};
 
	this.undo = function(levels) {
		console.log("отмена ("+ levels +")");
		for (var i=0; i < levels; i++) {
			if (this.current > 0) {
				this.commands[--this.current].undo(this.map);
			}
		}
	};
 
	this.redo = function(levels) {
		console.log("возврат ("+ levels +")");
		for (var i=0; i<levels; i++) {
			if (this.current < this.commands.length) {
				this.commands[this.current++].redo(this.map);
			}
		}
	};
}

window.redactor = new Redactor(new Map());

redactor.run(new AddPrism([ 1, 0, 0], [4,4,2]));
redactor.run(new AddPrism([ 0, 0, 0], [1,4,1]));
redactor.run(new AddPrism([-1, 1, 0], [1,2,1]));
redactor.run(new ResizePrism(2, [1,3,1]));

requestAnimFrame(animate);

function animate() {
	iso.canvas.clear();
	redactor.map.render(iso);


	renderer.render(stage);
	requestAnimFrame(animate);
}
