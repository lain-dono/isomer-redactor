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
function AddPrism(pos, size, color, scale, rotateZ) {
	this.redo = function(map) {
		map.objects.push({
			type: 'prism',
			pos:  pos    || [0,0,0],
			size: size   || [0,0,0],
			color:color  || [0,0,0,0],
			modificators: [],
			scale: scale  || {point: [0,0,0], s: [1,1,1]},
			rotateZ: rotateZ || {point: [0,0,0], yaw: 0},
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddPyramid(pos, size, color, scale, rotateZ) {
	this.redo = function(map) {
		map.objects.push({
			type: 'pyramid',
			pos:  pos     || [0,0,0],
			size: size    || [0,0,0],
			color: color  || [0,0,0,0],
			modificators: [],
			scale: scale  || {point: [0,0,0], s: [1,1,1]},
			rotateZ: rotateZ || {point: [0,0,0], yaw: 0},
		});
	};
	this.undo = function(map) {
		map.objects.pop();
	};
}

function AddCylinder(pos, size, color, scale, rotateZ) {
	this.redo = function(map) {
		map.objects.push({
			type: 'cylinder',
			pos:  pos     || [0,0,0],
			size: size    || [0,0,0],
			color: color  || [0,0,0,0],
			modificators: [],
			scale: scale  || {point: [0,0,0], s: [1,1,1]},
			rotateZ: rotateZ || {point: [0,0,0], yaw: 0},
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

function Scale(id, scale) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.scale;
		obj.scale = scale;
	};
	this.undo = function(map) {
		map.objects[id].scale = old;
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

function RotateZ(id, point, yaw) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.rotateZ;
		obj.rotateZ = {point: point, yaw: yaw};
	};
	this.undo = function(map) {
		map.objects[id].rotateZ = old;
	};
}

function RotateZ(id, point, yaw) {
	var old;
	this.redo = function(map) {
		var obj = map.objects[id];
		old = obj.rotateZ;
		obj.rotateZ = {point: point, yaw: yaw};
	};
	this.undo = function(map) {
		map.objects[id].rotateZ = old;
	};
}

module.exports = {
	Delete: Delete,
	AddPrism: AddPrism,
	AddPyramid: AddPyramid,
	AddCylinder: AddCylinder,
	SetColor: SetColor,
	ResizePrism: ResizePrism,
	Scale: Scale,
	Move: Move,
	RotateZ: RotateZ,
};
