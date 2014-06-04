"use strict";

var Isomer = require('isomer');

function Map(iso) {
	this.iso = iso;
	this.objects = [];

	var mod = function(add, obj) {
		for(var i=0, l=obj.modificators.length; i<l; i++) {
			var mod = obj.modificators[i];
			var point = Isomer.Point.apply(null, mod.point);

			switch(mod.type) {
			case 'rotateZ':
				add = add.rotateZ(point, mod.yaw);
				break;
			case 'scale':
				add = add.scale(point, mod.x, mod.y, mod.z);
				break;
			case 'translate':
				add = add.translate(point, mod.x, mod.y, mod.z);
				break;
			default:
				console.warn('fail mod.type', mod);
			}
		}
		return add;
	};

	this.render = function() {
		for (var i=0, l=this.objects.length; i<l; i++) {
			var obj = this.objects[i];
			var pos = obj.pos;
			var size = obj.size;
			var color = new Isomer.Color(obj.color[0], obj.color[1], obj.color[2], obj.color[3]);

			var add = null;

			switch(obj.type) {
			case 'prism':
				add = Isomer.Shape.Prism(Isomer.Point.apply(null, pos), obj.dx, obj.dy, obj.dz);
				break;
			case 'pyramid':
				add = Isomer.Shape.Pyramid(Isomer.Point.apply(null, pos), obj.dx, obj.dy, obj.dz);
				break;
			case 'cylinder':
				add = Isomer.Shape.Cylinder(Isomer.Point.apply(null, pos), obj.radius, obj.vertices, obj.height);
				break;
			default:
				console.warn('fail obj.type', obj);
			}

			if(add) {
				this.iso.add(mod(add, obj), color);
			}
		}
	};
}

module.exports = Map;
