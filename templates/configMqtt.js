module.exports.mqtt = {
	_hookTimeout: 20000,
	broker : 'mqtt://127.0.0.1',
	connect:{
		port : 1883	,
		clientId : 'sails_hook_mqtt_client',
		will:{
			topic:"server/disconnect",
			payload:JSON.stringify({msg:'i am off-line'}),
			qos:1,
			clean:false
		},
	},
	publishOption:{
		qos:1,
		retain : true,
		dup : false
	},
	subscribeOption:{
		qos:1
	},
	topics : [
		"topic/#"
	],
	handler : require('../mqtt/handler.js')
}
