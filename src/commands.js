"use strict";

function Delete(id) {
	var obj;
	this.redo = function(map) {
		obj = map.objects.splice(id, 1);
	};
	this.undo = function(map) {
		var left = map.objects.slice(0, id);
		var right = map.objects.slice(id);
		map.objects = [].concat(left, obj, right)
	};
}

function AddPrism(pos, size, color) {
	this.redo = function(map) {
		map.objects.push({
			type: 'prism',
			pos:  pos    || [0,0,0],
			dx: size[0],
			dy: size[1],
			dz: size[2],
			color:color  || [0,0,0,0],
			modificators: [],
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddPyramid(pos, size, color) {
	this.redo = function(map) {
		map.objects.push({
			type: 'pyramid',
			pos:  pos     || [0,0,0],
			dx: size[0],
			dy: size[1],
			dz: size[2],
			color: color  || [0,0,0,0],
			modificators: [],
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddCylinder(pos, size, color) {
	this.redo = function(map) {
		map.objects.push({
			type: 'cylinder',
			pos:  pos     || [0,0,0],
			radius: size[0],
			vertices: size[1],
			height: size[2],
			color: color  || [0,0,0,0],
			modificators: [],
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddPath(path, color) {
	this.redo = function(map) {
		map.objects.push({
			type: 'path',
			path: path,
			color: color  || [0,0,0,0],
			modificators: [],
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddShape(path, height, color) {
	this.redo = function(map) {
		map.objects.push({
			type: 'shape',
			path: path,
			height: height,
			color: color  || [0,0,0,0],
			modificators: [],
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function SetColor(id, color) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.color;
		obj.color = color;
	};
	this.undo = function(map) {
		var obj = map.objects[id];
		obj.color = old;
	};
}

function Resize(id, size) {
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

function Move(id, pos) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.pos;
		obj.pos = pos;
	};
	this.undo = function(map) {
		map.objects[id].pos = old;
	};
}

function Modificator(id, mod) {
	this.redo = function(map) {
		map.objects[id].modificators.push(mod);
	};
	this.undo = function(map) {
		map.objects[id].modificators.pop();
	};
}


module.exports = {
	Delete: Delete,
	AddPrism: AddPrism,
	AddPyramid: AddPyramid,
	AddCylinder: AddCylinder,
	AddPath: AddPath,
	AddShape: AddShape,

	SetColor: SetColor,
	Resize: Resize,
	Move: Move,
	Modificator: Modificator,
};
