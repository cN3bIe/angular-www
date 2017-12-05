module.exports = function(err){
	console.log('[Compilation Error]');
	console.log(err.fileName + ( err.loc ? `( ${err.loc.line}, ${err.loc.column} ): ` : ': '));
	console.log('error Babel: ' + err.message + '\n');
	console.log(err.codeFrame);
	this.emit('end');
};