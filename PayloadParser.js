function parseUplink(device, payload)
{
    var parsed = payload.asParsedObject();
    env.log(parsed);    

    // Store humidity
    var e = device.endpoints.byType(endpointType.humiditySensor);
    if (e != null)
        e.updateHumiditySensorStatus(parsed.humidity);

    // Store temperature
    e = device.endpoints.byType(endpointType.temperatureSensor);
    if (e != null)
        e.updateTemperatureSensorStatus(parsed.temperature);

    // Store CO2
    e = device.endpoints.byType(endpointType.ppmConcentrationSensor, ppmConcentrationSensorSubType.carbonDioxide);
    if (e != null)
        e.updatePpmConcentrationSensorStatus(parsed.co2);
// Store battery
    if (decoded.battery != null) {
          if (sensor1 != null)
          
    };

}


	// Parse and store humidity
	var humiditySensor = device.endpoints.byType(endpointType.humiditySensor);
	if (humiditySensor != null)
	{
		var humidity = bytes[1];
		humiditySensor.updateHumiditySensorStatus(humidity);
	}	  
	
	// Parse and store battery percentage
	var batteryPercentage = bytes[2];
	device.updateDeviceBattery({ percentage: batteryPercentage });
*/

}

function buildDownlink(device, endpoint, command, payload) 
{ 
	// This function allows you to convert a command from the platform 
	// into a payload to be sent to the device.
	// Learn more at https://wiki.cloud.studio/page/200

	// The parameters in this function are:
	// - device: object representing the device to which the command will
	//   be sent. 
	// - endpoint: endpoint object representing the endpoint to which the 
	//   command will be sent. May be null if the command is to be sent to 
	//   the device, and not to an individual endpoint within the device.
	// - command: object containing the command that needs to be sent. More
	//   information at https://wiki.cloud.studio/page/1195.

	// This example is written assuming a device that contains a single endpoint, 
	// of type appliance, that can be turned on, off, and toggled. 
	// It is assumed that a single byte must be sent in the payload, 
	// which indicates the type of operation.

/*
	 payload.port = 25; 	 	 // This device receives commands on LoRaWAN port 25 
	 payload.buildResult = downlinkBuildResult.ok; 

	 switch (command.type) { 
	 	 case commandType.onOff: 
	 	 	 switch (command.onOff.type) { 
	 	 	 	 case onOffCommandType.turnOn: 
	 	 	 	 	 payload.setAsBytes([30]); 	 	 // Command ID 30 is "turn on" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.turnOff: 
	 	 	 	 	 payload.setAsBytes([31]); 	 	 // Command ID 31 is "turn off" 
	 	 	 	 	 break; 
	 	 	 	 case onOffCommandType.toggle: 
	 	 	 	 	 payload.setAsBytes([32]); 	 	 // Command ID 32 is "toggle" 
	 	 	 	 	 break; 
	 	 	 	 default: 
	 	 	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 	 	 break; 
	 	 	 } 
	 	 	 break; 
	 	 default: 
	 	 	 payload.buildResult = downlinkBuildResult.unsupported; 
	 	 	 break; 
	 }
*/

}

function decoder(input) {
    var output = {};
    var bytes = input.bytes

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        if (channel_id === 0x01 && channel_type === 0x75) {
            output.BATTERY = bytes[i];
            i += 1;
        }

        else if (channel_id === 0x03 && channel_type === 0x67) {
            output.TEMPERATURE = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

        }

        else if (channel_id === 0x04 && channel_type === 0x68) {
            output.HUMIDITY = bytes[i] / 2;
            i += 1;
        }
        // CO2
        else if (channel_id === 0x07 && channel_type === 0x7d) {
            output.CO2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }
    }

    return output;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}


Para el AM308:

function decoder(input) {
    var output = {};
    var bytes = input.bytes

    for (var i = 0; i < bytes.length;) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];

        if (channel_id === 0x01 && channel_type === 0x75) {
            output.BATTERY = bytes[i];
            i += 1;
        }

        else if (channel_id === 0x03 && channel_type === 0x67) {
            output.TEMPERATURE = readInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;

        }

        else if (channel_id === 0x04 && channel_type === 0x68) {
            output.HUMIDITY = bytes[i] / 2;
            i += 1;
        }

        else if (channel_id === 0x05 && channel_type === 0x00) {
            output.PIR = bytes[i] === 1 ? "trigger" : "idle";
            i += 1;
        }

        else if (channel_id === 0x06 && channel_type === 0xcb) {
            output.LIGHT_LEVEL = bytes[i];
            i += 1;
        }

        else if (channel_id === 0x07 && channel_type === 0x7d) {
            output.CO2 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }

        else if (channel_id === 0x08 && channel_type === 0x7d) {
            output.TVOC = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }

        else if (channel_id === 0x09 && channel_type === 0x73) {
            output.PRESSURE = readUInt16LE(bytes.slice(i, i + 2)) / 10;
            i += 2;
        }

        else if (channel_id === 0x0a && channel_type === 0x7d) {
            output.HCHO = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }

        else if (channel_id === 0x0b && channel_type === 0x7d) {
            output.PM2_5 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }

        else if (channel_id === 0x0c && channel_type === 0x7d) {
            output.PM10 = readUInt16LE(bytes.slice(i, i + 2));
            i += 2;
        }

        else if (channel_id === 0x0d && channel_type === 0x7d) {
            output.O3 = readUInt16LE(bytes.slice(i, i + 2)) / 100;
            i += 2;
        }

        else if (channel_id === 0x0e && channel_type === 0x01) {
            output.BEEP = bytes[i] === 1 ? "yes" : "no";
            i += 1;
        }
        // AM307
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = readUInt16LE(bytes.slice(i + 6, i + 8)) / 2;
            data.pir = bytes[i + 8] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 9];
            data.co2 = readUInt16LE(bytes.slice(i + 10, i + 12));
            data.tvoc = readUInt16LE(bytes.slice(i + 12, i + 14));
            data.pressure = readUInt16LE(bytes.slice(i + 14, i + 16)) / 10;
            i += 16;

            output.history = output.history || [];
            output.history.push(data);
        }
        // AM308
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = readUInt16LE(bytes.slice(i + 6, i + 8)) / 2;
            data.pir = bytes[i + 8] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 9];
            data.co2 = readUInt16LE(bytes.slice(i + 10, i + 12));
            data.tvoc = readUInt16LE(bytes.slice(i + 12, i + 14));
            data.pressure = readUInt16LE(bytes.slice(i + 14, i + 16)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 16, i + 18));
            data.pm10 = readUInt16LE(bytes.slice(i + 18, i + 20));
            i += 20;

            output.history = output.history || [];
            output.history.push(data);
        }
        // AM319 CH2O
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = readUInt16LE(bytes.slice(i + 6, i + 8)) / 2;
            data.pir = bytes[i + 8] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 9];
            data.co2 = readUInt16LE(bytes.slice(i + 10, i + 12));
            data.tvoc = readUInt16LE(bytes.slice(i + 12, i + 14));
            data.pressure = readUInt16LE(bytes.slice(i + 14, i + 16)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 16, i + 18));
            data.pm10 = readUInt16LE(bytes.slice(i + 18, i + 20));
            data.hcho = readUInt16LE(bytes.slice(i + 20, i + 22)) / 100;
            i += 22;

            output.history = output.history || [];
            output.history.push(data);
        }
        // AM319 O3
        else if (channel_id === 0x20 && channel_type === 0xce) {
            var data = {};
            data.timestamp = readUInt32LE(bytes.slice(i, i + 4));
            data.temperature = readInt16LE(bytes.slice(i + 4, i + 6)) / 10;
            data.humidity = readUInt16LE(bytes.slice(i + 6, i + 8)) / 2;
            data.pir = bytes[i + 8] === 1 ? "trigger" : "idle";
            data.light_level = bytes[i + 9];
            data.co2 = readUInt16LE(bytes.slice(i + 10, i + 12));
            data.tvoc = readUInt16LE(bytes.slice(i + 12, i + 14));
            data.pressure = readUInt16LE(bytes.slice(i + 14, i + 16)) / 10;
            data.pm2_5 = readUInt16LE(bytes.slice(i + 16, i + 18));
            data.pm10 = readUInt16LE(bytes.slice(i + 18, i + 20));
            data.o3 = readUInt16LE(bytes.slice(i + 20, i + 22)) / 100;
            i += 22;

            output.history = output.history || [];
            output.history.push(data);
        } else {
            break;
        }

    }
    return output;
}

function readUInt16LE(bytes) {
    var value = (bytes[1] << 8) + bytes[0];
    return value & 0xffff;
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[3] << 24) + (bytes[2] << 16) + (bytes[1] << 8) + bytes[0];
    return (value & 0xffffffff) >>> 0;
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return ref > 0x7fffffff ? ref - 0x100000000 : ref;
}