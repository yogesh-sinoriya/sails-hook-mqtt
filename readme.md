# sails-hook-mqtt

> ### There are no updates planned for this hook for Sails v1.0 and beyond.
>
> Feel free to continue to use this hook in existing projects, as-is, as long as it's doing the job for you.
> Just note that it's no longer the approach the Sails core team uses for new apps.
> Instead, we are now recommending the approach for publish & subscribe mqtt to topics that is bundled as part of `sails new` in Sails v1.
>
> To try that out, run `sails new foo --caviar` using Sails >= v1.0 and Node <= v7.9.
>
> _If you're unsure or need advice, visit https://sailsjs.com/support._



[![Dependency Status](https://david-dm.org/yogesh-sinoriya/sails-hook-mqtt.svg)](https://david-dm.org/yogesh-sinoriya/sails-hook-mqtt)

Email hook for [Sails JS](http://sailsjs.org), using [MQTT.js](https://github.com/mqttjs/MQTT.js)

*Note: This requires Sails v0.10.6+.*

### Installation

`npm install sails-hook-mqtt`
After installation it create, 
1) config/mqtt.js, Mqtt Configuration
2) mqtt/hander.js, Event hander for mqtt client 
### Usage

`sails.hooks.mqtt.publish(topic, message, cb)`

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
topic       | ((string))          | Topic is the topic to publish to
message           | ((string))          | Data to use to replace template tokens
cb             | ((function))        | Callback to be run after publish message (or if an error occurs).

`sails.hooks.mqtt.subscribe(topic, cb)`

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
topic       | ((string))          | Topic is the topic to publish to
cb             | ((function))        | Callback to be run after subscribe message (or if an error occurs).

## Configuration

By default, configuration lives in `sails.config.mqtt` or ` config/mqtt.js`.  The configuration key (`mqtt`) can be changed by setting `sails.config.hooks['sails-hook-mqtt'].configKey`.

### broker
Broker URL

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
brocker        | ((string)) | brocker url, example `mqtt://127.0.0.1`

### connect
connection perameters

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
host        | ((string)) | any hostname or ip
port        | ((string)) | proker port no.
clientId    | ((string)) | Uniqe ID for mqtt client
username    | ((string)) | the username required by your broker, if any
password    | ((string)) | the password required by your broker, if any
resubscribe | ((string)) | if connection is broken and reconnects, subscribed topics are automatically subscribed again (default true)
reconnectPeriod | ((string)) | 1000 milliseconds, interval between two reconnections
connectTimeout  | ((string)) | 30 * 1000 milliseconds, time to wait before a CONNACK is received
queueQoSZero    | ((string)) | if connection is broken, queue outgoing QoS zero messages (default true)
clean       | ((string)) | true, set to false to receive QoS 1 and 2 messages while offline
will        | ((string)) | a message that will sent by the broker automatically when the client disconnect badly, format in example.
key         | ((string)) | absolute path to key
cert        | ((string)) | absolute path to cert
ca          | ((string)) | absolute path to ca
handler     | ((object)) | handler to manage the events.

### publishOptions
option on publish message

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
qos         | ((string)) | QoS level, Number, default 0
retain      | ((string)) | retain flag, Boolean, default false
dup         | ((string)) | mark as duplicate flag, Boolean, default false

### subscribeOptions
option on subscribe topic

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
qos         | ((string)) | QoS level, Number, default 0

### topics
Array of default topics (`string`)

#### Example

```javascript
// [your-sails-app]/config/mqtt.js

module.exports.mqtt = {
  _hookTimeout: 20000,
  broker : 'mqtt://127.0.0.1',                        // broker url
  connect:{                                           // connection config
    host : '127.0.0.1',                         // host name <optional></optional>
    port : 8883 ,                                   // port no.
    clientId : 'sails_hook_mqtt_client',            // client id
     protocolId: 'MQTT',                            // protocol id (optional)
    username:'test_client',                         // mqtt basic auth (optional)
    password:'public',                              // mqtt basic auth (optional)      
    resubscribe: true,                              // (optional)
    reconnectPeriod:1000,                           // (optional)
    connectTimeout:30*1000,                         // (optional)
    queueQoSZero:true,  //if connection is broken, queue outgoing QoS zero messages (default true)(optional)
    will:{                                          // a message that will sent by the broker automatically when the client disconnect badly (optional)
      topic:"server/disconnect",
      payload:JSON.stringify({msg:'i am off-line'}),
      qos:1,
      clean:false
    },
    key : 'path_to/server.key',                    // Absolute path to key (optional)
    cert :'path_to/server.crt',                   // Absolute path to cert (optional)
    ca :  'path_to/ca.crt',                        // Absolute path to ca (optional)
    clean: false,                                   // (optional)
  },
  publishOption:{                                   // default option to subcribe topics
    qos:1,                                          // QoS level, Number, default 0 (optional)
    retain : true,                                  //retain flag, Boolean, default false (optional)
    dup : false                                     // mark as duplicate flag, Boolean, default false (optional)
  },
    subscribeOption:{                                   // default option to subcribe topics (optional)
    qos:1                                         // QoS level, Number, default 0 (optional)
  },
  topics : [                                          // default topics to subcriblbe
    "topic/#"
  ],
  handler : require('../mqtt/handler.js')             // handler object
}
```


### Example
executing the following command (after [configuring for your mqtt service](https://github.com/yogesh-sinoriya/sails-hook-mqtt/#configuration) and turning off test mode) :

```
// PUBLISH MESSAGE TO TOPIC OR TOPICS(`array of topics`)

sails.hooks.mqtt.publish('topic/any',"Hi, I am published message",function(err){
  if(err){
    sails.log.error(new Error(err));
  }
  sails.log.debug('Message published successfully');
});

//SUBSCRIBE TOPIC OR TOPICS(`array of topics`)
sails.hooks.mqtt.subscribe('topic/#',function(err, granted){
  if(err){
    sails.log.error(new Error(err));
  }
  sails.log.debug('Topic subscribe successfully');
});
```

