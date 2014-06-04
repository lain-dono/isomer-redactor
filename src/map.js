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
