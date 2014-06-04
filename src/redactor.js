"use strict";

var commands = require('./commands');

function Redactor(map) {
	this.commands = [];
	this.current = 0;
	this.map = map;

	this.render = function() {
		//this.map.canvas.drawRect(x, y, width, height);
		// grid
		//
		var iso = this.map.iso;

		var ctx = iso.canvas;
		ctx.clear();
		ctx.lineStyle(1, 0xCCCCCC, 1);
		for(x=-20; x<21; x++) {
				var s1 = this.map.iso._translatePoint(Isomer.Point(x, -20, 0));
				var e1 = this.map.iso._translatePoint(Isomer.Point(x, +20, 0));
				var s2 = this.map.iso._translatePoint(Isomer.Point(-20, x, 0));
				var e2 = this.map.iso._translatePoint(Isomer.Point(+20, x, 0));
				ctx.moveTo(s1.x, s1.y);
				ctx.lineTo(e1.x, e1.y);
				ctx.moveTo(s2.x, s2.y);
				ctx.lineTo(e2.x, e2.y);
		}

		ctx.lineStyle(0);
		this.map.render();

		ctx.lineStyle(3, 0xCC0000, 1);
		var obj = this.map.objects[active];
		if(obj) {
			var item = this.map._render_one(obj);
			if (item instanceof Isomer.Shape) {
				var paths = item.orderedPaths();
				for (var i in paths) {
					ctx.path_line(paths[i].points.map(iso._translatePoint.bind(iso)));
				}
			}
			if (item instanceof Isomer.Path) {
				ctx.path_line(item.points.map(iso._translatePoint.bind(iso)));
			}
		}
	}

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

	$('#AddCylinder').click(function() {
		var x = $('#AddCylinderModal#x').value,
			y = $('#AddCylinderModal#y').value,
			z = $('#AddCylinderModal #z').value,
			radius = $('#AddCylinderModal #radius').value,
			vertices = $('#AddCylinderModal #vertices').value,
			height = $('#AddCylinderModal #height').value;
		that.run(new commands.AddCylinder([x, y, z], [radius, vertices, height]));
	});

	var active = -1;
	var set_active = function(id) {
		console.info('set_active', id);
		active = id;
		$(list_class+' li a').each(function(index, element){
			var $el = $(element);
			// XXX hack
			if($el.attr('id') != 'obj' + id) {
				$el.parent().removeClass('uk-active');
			} else {
				$el.parent().addClass('uk-active');
			}
		});
	};
	var sync_list = function() {
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
