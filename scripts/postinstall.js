var semver    = require('semver');
var path      = require('path');
var moduleDir = '../';
var homeDir   = '../../'
var requireDir= homeDir + moduleDir
var fs = require('fs');
var util = require('util');

console.log(__dirname);
fs.exists('node_modules/sails', function(exists){
	if(exists){
		var sailsVersion = require('node_modules/sails/package.json').version;
		createMqtt(function(){
			if(semver.lt(sailsVersion, '0.11.0')) createHook(function(){});
		});
	} else {
		console.log('DEBUG: ','You are not using a sails project. Please use a sails project.',exists );
	}
})

function createMqtt(cb){
	fs.exists(homeDir + 'config/mqtt.js', function(exists){
		if(exists) {
			console.log('Mqtt file already exists.');
			generateHandlerDir(cb);
		} else {
			generateMqtt(cb);
		};

	});
}

function createHook(cb){
	fs.exists(homeDir + 'api/hooks', function(exists){
		if(exists){
			fs.exists(homeDir + 'api/hooks/mqtt', function(exists){
				if(exists){
					generateHook(cb);
				} else {
					generateHookDir(cb);
				}
			});
		} else {
			generateHooksDir(cb);
		}
	});
}

function generateMqtt(cb){
	fs.readFile('./templates/configMqtt.js', function(err, data){
		fs.writeFile(homeDir + 'config/mqtt.js', data, function(err){
			console.log('Mqtt file was generated');
			// cb();
			generateHandlerDir(cb);
		});
	});
}

function generateHook(cb){
	fs.exists(homeDir + 'api/hooks/mqtt/index.js', function(exists){
		if(exists){
			console.log('Hook file already exists');
			cb();
		} else {
			fs.readFile('./templates/index.js', function(err, data){
				fs.writeFile(homeDir + 'api/hooks/mqtt/index.js', data, function(err){
					console.log('Hook file was generated');
					cb();
				});
			});
		}
	});
}

function generateHookDir(cb){
	fs.mkdir(homeDir + '/api/hooks/mqtt', function(err){
		console.log('Mqtt Hook Dir File Generated');
		generateHook(cb);
	});
}

function generateHooksDir(cb){
	fs.mkdir(homeDir + '/api/hooks', function(err){
		console.log('Hooks dir generated');
		fs.exists(homeDir + 'api/hooks/mqtt', function(exists){
			if(exists){
				generateHook(cb);
			} else {
				generateHookDir(cb);
			}
		});
	});
}

function generateHooksDir(cb){
	fs.mkdir(homeDir + '/api/hooks', function(err){
		console.log('Hooks dir generated');
		fs.exists(homeDir + 'api/hooks/mqtt', function(exists){
			if(exists){
				generateHook(cb);
			} else {
				generateHookDir(cb);
			}
		});
	});
}

function generateHandlerDir(cb){
	fs.exists(homeDir + '/mqtt', function(exists){
		if(exists){
			generateHandler(cb);
		} else {
			fs.mkdir(homeDir + '/mqtt', function(err){
				console.log('Mqtt Handler Dir Generated');
				generateHandler(cb);
			});
		}
	});
}

function generateHandler(cb){
	fs.exists(homeDir + '/mqtt/handler.js', function(exists){
		if(exists){
			console.log('Handler file already exists');
			cb();
		} else {
			fs.readFile('./templates/handler.js', function(err, data){
				fs.writeFile(homeDir + '/mqtt/handler.js', data, function(err){
					console.log('Hook file was generated');
					cb();
				});
			});
		}
	});
}
