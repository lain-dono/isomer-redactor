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
function AddPrism(pos, size) {
	this.redo = function(map) {
		map.objects.push({type: 'prism', pos: pos, size: size, rotateZ: {point: [0,0,0], yaw: 0}, color:[0,0,0,0]})
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
};

module.exports = {
	Delete: Delete,
	AddPrism: AddPrism,
	ResizePrism: ResizePrism,
	Move: Move,
	RotateZ: RotateZ,
};
