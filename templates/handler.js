var temp_flag = false;
module.exports  = {
message : function(topic, message, packet) {
	sails.log.silly(topic, message.toString());
},

connect : function(connack){
			sails.log.info("service started....");
		temp_flag = true;
},

reconnect : function(){
	if(temp_flag){
			sails.log.info("reconnecting....");
		temp_flag = false;
	}

},

close : function(){
	if(temp_flag){
			sails.log.info("service closed");
		temp_flag = false;
		return;
	}
},

offline : function(){
	if(temp_flag){
			sails.log.info("broker is offline");
		//temp_flag = false;
	}
},

error : function(error){
		sails.log.info('\n\n\nSome thing went wrong!!\n\n\n',error);
},

packetsend : function(packet){
		// sails.log.info("packetsend", packet.cmd);

},

packetreceive	 : function(packet){
		// sails.log.info("packetreceive", packet.cmd);
}
};
		