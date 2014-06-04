(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
console.log('start');

window.commands = require('./commands');
var Redactor = require('./redactor');
var Map = require('./map');

var w = window.innerWidth,
	h = window.innerHeight,
	stage = new PIXI.Stage(0xCC0000, true),
	renderer = PIXI.autoDetectRenderer(w, h);
$('#canvas').append(renderer.view);

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
	w = $('#canvas').width();
	h = window.innerHeight - $('#canvas').position().top

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
redactor.run(new commands.Scale(redactor.map.objects.length-1, {point:[2,4,3], s:[0.5]}));

redactor.run(new commands.AddPyramid([4, 3, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [180,0,180,0]));
redactor.run(new commands.Scale(redactor.map.objects.length-1, {point:[5,4,3], s:[0.5]}));

redactor.run(new commands.AddPyramid([4, 1, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [0,180,0,0]));
redactor.run(new commands.Scale(redactor.map.objects.length-1, {point:[5,1,3], s:[0.5]}));

redactor.run(new commands.AddPyramid([2, 1, 3], [1,1,1]));
redactor.run(new commands.SetColor(redactor.map.objects.length-1, [40,180,40,0]));
redactor.run(new commands.Scale(redactor.map.objects.length-1, {point:[2,1,3], s:[0.5]}));

redactor.run(new commands.Delete(2));
redactor.run(new commands.ResizePrism(1, [1,3,1]));
redactor.run(new commands.RotateZ(1, [1/2,3/2,1/2], Math.PI/8));

redactor.run(new commands.AddCylinder([0, 2, 0], [1,30,2]));

requestAnimFrame(animate);

function animate() {
	iso.canvas.clear();
	redactor.map.render();

	renderer.render(stage);
	requestAnimFrame(animate);
}

},{"./commands":1,"./map":3,"./redactor":4}],3:[function(require,module,exports){
function Map(iso) {
	this.iso = iso;
	this.objects = [];
	this.render = function() {
		for (var i=0, l=this.objects.length; i<l; i++) {
			var obj = this.objects[i];

			var pos = obj.pos;
			var size = obj.size;
			var color = new Isomer.Color(obj.color[0], obj.color[1], obj.color[2], obj.color[3]);

			var add = null;

			switch(obj.type) {
			case 'prism':
				add = Isomer.Shape.Prism(Isomer.Point.apply(null, pos), size[0], size[1], size[2]);
				break;

			case 'pyramid':
				add = Isomer.Shape.Pyramid(Isomer.Point.apply(null, pos), size[0], size[1], size[2]);
				break;

			case 'cylinder':
				add = Isomer.Shape.Cylinder(Isomer.Point.apply(null, pos), size[0], size[1], size[2]);
				break;

			default:
				console.warn('fail obj.type', obj);
			}

			if(add) {
				if(obj.rotateZ) {
					var rotPoint = Isomer.Point.apply(null, obj.rotateZ.point);
					add = add.rotateZ(rotPoint, obj.rotateZ.yaw);
				}
				if(obj.scale) {
					var scalePoint = Isomer.Point.apply(null, obj.scale.point);
					add = add.scale(scalePoint, obj.scale.s[0], obj.scale.s[1], obj.scale.s[2]);
				}
				this.iso.add(add, color);
			}
		}
	};
}

module.exports = Map;

},{}],4:[function(require,module,exports){
var commands = require('./commands');

function Redactor(map) {
	this.commands = [];
	this.current = 0;
	this.map = map;

	// FIXME add Backbone or other for UI and move all to other files

	$.UIkit.notify({
		message : 'Hello Kitty!',
		status  : 'info',
		timeout : 5000,
		pos     : 'top-center'
	});


	var that = this;

	var list_class = '#obj-list';
	var $list = $(list_class);

	$('#AddPrism').click(function() {
		var x = $('#AddPrismModal #x').value,
			y = $('#AddPrismModal #y').value,
			z = $('#AddPrismModal #z').value,
			dx = $('#AddPrismModal #dx').value,
			dy = $('#AddPrismModal #dy').value,
			dz = $('#AddPrismModal #dz').value;
		that.run(new commands.AddPrism([x, y, z], [dx, dy, dz]));
	});

	$('#AddPyramid').click(function() {
		var x = $('#AddPyramidModal #x').value,
			y = $('#AddPyramidModal #y').value,
			z = $('#AddPyramidModal #z').value,
			dx = $('#AddPyramidModal #dx').value,
			dy = $('#AddPyramidModal #dy').value,
			dz = $('#AddPyramidModal #dz').value;
		that.run(new commands.AddPyramid([x, y, z], [dx, dy, dz]));
	});

	var active = -1;
	var set_active = function(id) {
		console.info('set_active', id);
		active = id;
		$(list_class+' li a').each(function(index, element){
			var $el = $(element);
			// XXX hack
			if($el.attr('id') != 'obj' + id) {
				console.log('removeClass', $el.attr('id'));
				$el.parent().removeClass('uk-active');
			} else {
				console.log('addClass', $el.attr('id'));
				$el.parent().addClass('uk-active');
			}
		});
	};
	var sync_list = function() {
		//that.map.objects
		$list.html('');
		for(var i=0, l=that.map.objects.length; i<l; i++) {
			var obj = that.map.objects[i];
			// XXX hack
			var a = $('<a id="obj'+i+'" href="#">'+ i +' '+ obj.type +'</a>');
			a.click(function(){
				var $this = $(this);
				// XXX hack
				var id = $this.attr('id').slice(3) |0
				set_active(id);
				console.info('click', id);
			});
			var li = $('<li></li>');
			$list.append(li.append(a));
		}
	};
	sync_list();

	var msg_success = {pos:'top-right', timeout:150, status:'success'};
	var msg_danger  = {pos:'top-right', timeout:150, status:'danger'};
	$('#undo').click(function(event) {
		event.preventDefault();
		if(that.undo(1)) {
			$.UIkit.notify('undo', msg_success);
		} else {
			$.UIkit.notify('undo empty', msg_danger);
		}
	});
	$('#redo').click(function(event) {
		event.preventDefault();
		if(that.redo(1)) {
			$.UIkit.notify('redo', msg_success);
		} else {
			$.UIkit.notify('redo empty', msg_danger);
		}
	});

	this.run = function(command) {
		console.log('spliceX', this.current, this.commands.length -1);
		if (this.current < this.commands.length-1) {
			this.commands.splice(this.current);
			console.log('splice');
		}
		command.redo(this.map);
		this.commands.push(command);
		this.current++;
		$.UIkit.notify(command.constructor.name, msg_success);
		console.info('run', command.constructor.name)
		sync_list();
		set_active(active);
	};
 
	this.undo = function(levels) {
		var count=0;
		for (var i=0; i < levels; i++) {
			if (this.current > 0) {
				this.commands[--this.current].undo(this.map);
				count++;
			}
		}
		console.info('undo '+ count +'('+ levels +')');
		sync_list();
		set_active(active);
		return count;
	};

	this.redo = function(levels) {
		var count=0;
		for (var i=0; i<levels; i++) {
			if (this.current < this.commands.length) {
				this.commands[this.current++].redo(this.map);
				count++;
			}
		}
		console.info('redo '+ count +'('+ levels +')');
		sync_list();
		set_active(active);
		return count;
	};
}

module.exports = Redactor;

},{"./commands":1}]},{},[2])