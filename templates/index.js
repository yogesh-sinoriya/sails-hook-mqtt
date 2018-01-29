/**
 * mqtt hook
 */


/* *************************************************************
 * Import Required Node Modules
 * *************************************************************/

var mqtt = require('mqtt');
var fs = require('fs');
var async = require('async');
var path = require('path');


module.exports = function (sails) {
return {
	/**
	 * Default configuration
	 * @type {Object}
	 */
	defaults: {
		__configKey__: {
			_hookTimeout: 20000,
			broker : 'mqtt://127.0.0.1',
			connect:{
				host : '127.0.0.1',
				port : 1883,
				protocolId: 'MQTT',
				clientId : 'mqtt_sails_client',
				clean: false,
				qos:1,
				resubscribe: true,
				reconnectPeriod:1000,
				connectTimeout:30*1000,
				queueQoSZero:true, //if connection is broken, queue outgoing QoS zero messages (default true)
				will:{
					topic:"device/disconnect",
					payload:{msg:'i am disconnected'},
					qos:'1',
					retain:true
				}
			},
			subscribeOption:{
				qos:1,
				retain : false,
				dup : false
			},
			topics : [
				"server/#"
			],
			handler : require(sails.config.appPath+'/mqtt/handler.js')
		}
	},
	configure: function () {
		if(sails.config.mqtt.broker){
			sails.config[this.configKey].broker = sails.config.mqtt.broker;
		}
		if(sails.config.mqtt.connect){
			for(key in sails.config.mqtt.connect){
				if(key == 'key' || key == 'cert' || key == 'ca'){
					sails.config[this.configKey].connect[key] = fs.readFileSync(path.join(sails.config.mqtt.connect[key]));
					// sails.log.debug(key,sails.config.mqtt.connect[key]);
				}else{
					sails.config[this.configKey].connect[key] = sails.config.mqtt.connect[key];
				}
			}
		}
		if(sails.config.mqtt.subscribeOption){
			for(key in sails.config.mqtt.subscribeOption){
				sails.config[this.configKey].subscribeOption[key] = sails.config.mqtt.subscribeOption[key];
			}
		}
		if(sails.config.mqtt.publishOption){
			for(key in sails.config.mqtt.publishOption){
				sails.config[this.configKey].publishOption[key] = sails.config.mqtt.publishOption[key];
			}
		}
		if(sails.config.mqtt.topics){
			sails.config[this.configKey].topics = sails.config.mqtt.topics;
		}
		if(sails.config.mqtt.handler){
			sails.config[this.configKey].handler = sails.config.mqtt.handler;
		}
	},
	initialize: function (next) {
		self = this;
		var eventsToWaitFor = [];
		if(sails.hooks.orm) eventsToWaitFor.push('hook:orm:loaded');
		if(sails.hooks.pubsub) eventsToWaitFor.push('hook:pubsub:loaded');

		sails.after(eventsToWaitFor, function(){
			self.client = mqtt.connect(sails.config[self.configKey].broker,sails.config[self.configKey].connect);
			sails.log.info(sails.config[self.configKey].connect.ca);
			self.client.on('connect', function(connack) {
				sails.log.info('\x1b[36m%s\x1b[0m','MQTT client successfully connected');
				async.series([
					function(callback) {
						sails.config[self.configKey].handler.connect(connack);
						callback(null, 'one');
					},
					function(callback) {
						for(i in sails.config[self.configKey].topics){
							self.client.subscribe(sails.config[self.configKey].topics[i],sails.config[self.configKey].subscribeOption.qos);
						}
						callback(null, 'two');
					}
				],function(err, results) {
					sails.log.info('\x1b[36m%s\x1b[0m','MQTT client started successfully!');
				});
			});
			self.client.on('reconnect', function() {
				sails.config[self.configKey].handler.reconnect();
			});
			self.client.on('close', function() {
				sails.config[self.configKey].handler.close();
			});
			self.client.on('offline', function() {
				sails.config[self.configKey].handler.offline();
			});
			self.client.on('error', function(error) {
				sails.config[self.configKey].handler.error(error);
			});
			self.client.on('packetsend', function(packet) {
				sails.config[self.configKey].handler.packetsend(packet);
			});
			self.client.on('packetreceive', function(packet) {
				sails.config[self.configKey].handler.packetreceive(packet);
			});
			self.client.on('message', function(topic, message, packet) {
				sails.config[self.configKey].handler.message(topic, message, packet);
			});

			sails.on('lower', function() {
				self.client.end(false, function(){
					sails.log.debug('\x1b[36m%s\x1b[0m','MQTT client stopped successfully!');
				});
		 	});

			return next();
		});
	},

	/**
	 * Publish a topic.
	 * @param  {Sting}    topic (a named topic to publish)
	 * @param  {Sting}    payload (data to pass into the topic)
	 * @param  {Function} cb
	 */
	publish:function(topic, payload, callback){

		var publish = function(topic,payload){
			self.client.publish(topic,payload,sails.config[self.configKey].publishOption,function(err){
				if(err){
					sails.log.error(new Error ('msg not published!'));
					callback(err);
				}else{
					sails.log.info('\x1b[36m%s\x1b[0m','message successfully published to '+topic);
					callback(null);
				}
			});
		}

		if(typeof topic === 'string'){
			publish(topic,payload);
		}else{
			for(i in topic){
				publish(topic[i],payload);
			}
		}
	},

	subscribe:function(topic, callback){
		var subscribe = function(topic,option, callback){
			self.client.subscribe(topic,option,function(err, granted){
				if(err){
					sails.log.error(new Error ('topic not subscribed'));
					callback(err, granted);
				}else{
					sails.log.info('\x1b[36m%s\x1b[0m','topic successfully subscribed');
					callback(null, granted);
				}
			});
		}
		if(typeof topic === 'string'){
			subscribe(topic,sails.config[self.configKey].subscribeOption, callback);
		}else{
			for(i in topic){
				subscribe(topic[i],sails.config[self.configKey].subscribeOption, callback);
			}
		}
	}
};
};
