function Map(iso) {
	this.iso = iso;
	this.objects = [];
	this.render = function() {
		for (var i=0, l=this.objects.length; i<l; i++) {
			var obj = this.objects[i];

			var pos = obj.pos;
			var size = obj.size;
			var rotPoint = Isomer.Point.apply(null, obj.rotateZ.point);
			var scalePoint = Isomer.Point.apply(null, obj.scale.point);
			var color = new Isomer.Color(obj.color[0], obj.color[1], obj.color[2], obj.color[3]);

			switch(obj.type) {
			case 'prism':
				var prism = Isomer.Shape.Prism(Isomer.Point.apply(null, pos), size[0], size[1], size[2]);
				this.iso.add(prism.rotateZ(rotPoint, obj.rotateZ.yaw).scale(scalePoint, obj.scale.s[0], obj.scale.s[1], obj.scale.s[2]), color);
				break;

			case 'pyramid':
				var pyramid = Isomer.Shape.Pyramid(Isomer.Point.apply(null, pos), size[0], size[1], size[2]);
				this.iso.add(pyramid.rotateZ(rotPoint, obj.rotateZ.yaw).scale(scalePoint, obj.scale.s[0], obj.scale.s[1], obj.scale.s[2]), color);
				break;

			default:
				console.warn('fail obj.type', obj);
			}
		}
	};
}

module.exports = Map;
