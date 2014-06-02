function Map(iso) {
	this.iso = iso;
	this.objects = [];
	this.render = function() {
		for (var i=0, l=this.objects.length; i<l; i++) {
			var obj = this.objects[i];
			switch(obj.type) {
			case 'prism':
				var pos = obj.pos;
				var size = obj.size;
				var rotp = obj.rotateZ.point;
				var prism = Isomer.Shape.Prism(new Isomer.Point(pos[0], pos[1], pos[2]), size[0], size[1], size[2]);
				this.iso.add(prism.rotateZ(new Isomer.Point(rotp[0], rotp[1], rotp[2]), obj.rotateZ.yaw));
				break;
			default:
				console.warn('fail obj.type', obj);
			}
		}
	};
}

module.exports = Map;
