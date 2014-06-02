function Redactor(map) {
	this.commands = [];
	this.current = 0;
	this.map = map;

	this.run = function(command) {
		if (this.current < this.commands.length-1) {
			this.commands.splice(this.current);
		}
		command.redo(this.map);
		this.commands.push(command);
		this.current++;
		console.log('run', command.constructor.name)
	};
 
	this.undo = function(levels) {
		console.log('undo ('+ levels +')');
		for (var i=0; i < levels; i++) {
			if (this.current > 0) {
				this.commands[--this.current].undo(this.map);
			}
		}
	};
 
	this.redo = function(levels) {
		console.log('undo ('+ levels +')');
		for (var i=0; i<levels; i++) {
			if (this.current < this.commands.length) {
				this.commands[this.current++].redo(this.map);
			}
		}
	};
}

module.exports = Redactor;
