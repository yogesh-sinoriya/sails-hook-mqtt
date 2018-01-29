var semver    = require('semver');
var path      = require('path');
var moduleDir = path.join(__dirname+'/../');
var homeDir   = path.join(__dirname+'/../../');
var requireDir= path.join(__dirname+'/../../../');
var fs = require('fs');
var util = require('util');

console.log(requireDir, homeDir, moduleDir);
fs.exists(requireDir+'/node_modules/sails', function(exists){
	if(exists){
		var sailsVersion = require(requireDir+'/node_modules/sails/package.json').version;
		createMqtt(function(){
			if(semver.lt(sailsVersion, '0.11.0')) createHook(function(){});
		});
	} else {
		console.log('DEBUG: ','You are not using a sails project. Please use a sails project.',exists );
	}
})

function createMqtt(cb){
	fs.exists(requireDir + 'config/mqtt.js', function(exists){
		if(exists) {
			console.log('Mqtt file already exists.');
			generateHandlerDir(cb);
		} else {
			generateMqtt(cb);
		};

	});
}

function createHook(cb){
	fs.exists(requireDir + 'api/hooks', function(exists){
		if(exists){
			fs.exists(requireDir + 'api/hooks/mqtt', function(exists){
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
	fs.readFile(moduleDir+'/templates/configMqtt.js', function(err, data){
		if(err){
			console.error(new Error(err));
		}else{
			fs.writeFile(requireDir + 'config/mqtt.js', data, function(err){
				if(err){
					console.error(new Error(err));
				}else{
					console.log('Mqtt file generated');
					// cb();
					generateHandlerDir(cb);
				}
				
			});
		}
	});
}

function generateHook(cb){
	fs.exists(requireDir + 'api/hooks/mqtt/index.js', function(exists){
		if(exists){
			console.log('Hook file already exists');
			cb();
		} else {
			fs.readFile(moduleDir+'/templates/index.js', function(err, data){
				fs.writeFile(requireDir + 'api/hooks/mqtt/index.js', data, function(err){
					console.log('Hook file was generated');
					cb();
				});
			});
		}
	});
}

function generateHookDir(cb){
	fs.mkdir(requireDir + '/api/hooks/mqtt', function(err){
		console.log('Mqtt Hook Dir File Generated');
		generateHook(cb);
	});
}

function generateHooksDir(cb){
	fs.mkdir(requireDir + '/api/hooks', function(err){
		console.log('Hooks dir generated');
		fs.exists(requireDir + 'api/hooks/mqtt', function(exists){
			if(exists){
				generateHook(cb);
			} else {
				generateHookDir(cb);
			}
		});
	});
}

function generateHooksDir(cb){
	fs.mkdir(requireDir + '/api/hooks', function(err){
		console.log('Hooks dir generated');
		fs.exists(requireDir + 'api/hooks/mqtt', function(exists){
			if(exists){
				generateHook(cb);
			} else {
				generateHookDir(cb);
			}
		});
	});
}

function generateHandlerDir(cb){
	fs.exists(requireDir + '/mqtt', function(exists){
		if(exists){
			generateHandler(cb);
		} else {
			fs.mkdir(requireDir + '/mqtt', function(err){
				console.log('Mqtt Handler Dir Generated');
				generateHandler(cb);
			});
		}
	});
}

function generateHandler(cb){
	fs.exists(requireDir + '/mqtt/handler.js', function(exists){
		if(exists){
			console.log('Handler file already exists');
			cb();
		} else {
			fs.readFile(moduleDir+'/templates/handler.js', function(err, data){
				fs.writeFile(requireDir + '/mqtt/handler.js', data, function(err){
					console.log('Hook file was generated');
					cb();
				});
			});
		}
	});
}
