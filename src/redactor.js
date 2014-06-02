function Redactor(map) {
	this.commands = [];
	this.current = 0;
	this.map = map;


	$.UIkit.notify({
		message : 'Hello Kitty!',
		status  : 'info',
		timeout : 5000,
		pos     : 'top-center'
	});

	var that = this;

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
		console.log('run', command.constructor.name)
	};
 
	this.undo = function(levels) {
		var count=0;
		for (var i=0; i < levels; i++) {
			if (this.current > 0) {
				this.commands[--this.current].undo(this.map);
				count++;
			}
		}
		console.log('undo '+ count +'('+ levels +')');
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
		console.log('redo '+ count +'('+ levels +')');
		return count;
	};
}

module.exports = Redactor;
