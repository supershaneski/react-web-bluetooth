import React, { useState } from 'react';
import classes from './Notification.module.css';


DataView.prototype.getFLOAT = function(byteOffset, littleEndian) {
	if (this.byteLength < byteOffset + 4)
		return 0;
	// 1. Get 32bit data considering byte order.
  	let data = this.getUint32(byteOffset, littleEndian);
  	// 2. Get mantissa.
  	let mantissa = (data & 0x00FFFFFF);
  	// Check if mantissa is two's complement.
  	if ((mantissa & 0x00800000) > 0) {
    	// In case of negative, get value by using two's complement.
    	mantissa = -1 * (~(mantissa - 0x01) & 0x00FFFFFF);
  	}
  	// 3. Get exponential.
  	// ">>" of JavaScript is signed right shift thus it considers two's complement to convert to decimal.
  	let exponential = data >> 24;
  	return mantissa * Math.pow(10, exponential);
}



var heartRateChar;

export default function Notification() {

    const [ message, setMessage ] = useState("Ready");
    const [ isConnected, setConnected ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);

    //let writeValue = 255;

    const handleConnect = () => {
        if(isConnected) {
            onStop();
        } else {
            onStart();
        }
    }

    const onStart = () => {

        setMessage("Scanning...")

        navigator.bluetooth.requestDevice({
            filters: [{
                services: ['heart_rate']
            }]
        }).then(device => {

            setMessage("Connected...")

            console.log('Got device:', device.name);
            console.log('id:', device.id);
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService('heart_rate'))
        .then(service => {

            service.getCharacteristic('heart_rate_control_point')
                .then(characteristic => {
                    heartRateChar = characteristic;
                    return heartRateChar.startNotifications();
                })
                .then(_ => {

                    setConnected(true);
                    setDisabled(false)

                    setMessage("Listening for notification...")

                    console.log("Notification start");
                    heartRateChar.addEventListener('characteristicvaluechanged', onHeartRateControlPointChanged);
                })
                .catch(error => {
                    setConnected(false);
                    setDisabled(true)

                    setMessage("Failed to subscribe to notification")

                    console.log('Failed Notification:' + error);
                })

        })
        .catch(error => {
            setMessage("User cancelled")
            setConnected(false);
            setDisabled(true)
            console.log(error);
        })

    }

    const onStop = () => {
        
        if(!heartRateChar) return;

        heartRateChar.stopNotifications()
            .then(_ => {
                console.log("Battery Service Stopped");
                setMessage("Disconnected")
                setDisabled(true)
                setConnected(false);
            })
            .catch(error => {
                console.log('Battery Service:' + error);
                setMessage("Disconnected with errors")
                setDisabled(true)
                setConnected(false);
            });

    }

    const onHeartRateControlPointChanged = (event) => {
        
        let value = event.target.value;
        if (!value.byteLength) {
          return;
        }
        
        let offset = 0
        let flag = value.getUint8(offset);
    
        let temp = value.getUint8(offset);
        let hex = temp.toString(16).toUpperCase();

        console.log(temp.toString(16), temp)

        setMessage(`Value received from the device: 0x${hex}`)

    }

    const handleWrite = () => {
        const writeValue = 200; //255;

        var buffer = new ArrayBuffer(1);
        var bufView = new Uint8Array(buffer);
        bufView[0] = writeValue; //255; // 0-255
        
        setMessage(`Writing value...`);

        heartRateChar.writeValue(buffer)
            .then(_ => {

                const hex = writeValue.toString(16).toUpperCase();

                setMessage(`Write value successful. Int(${writeValue}) Hex(0x${hex})`);
            })
            .catch(error => {
                setMessage(`Writing failed`);
            });

    }

    const buttonText = (isConnected)?"Disconnect":"Connect to Heart Rate Device";

    return (
        <div className={classes.container}>
            <div className={classes.control}>
                <button onClick={handleConnect} className={classes.button}>Connect to Heart Rate Device</button>
                <button disabled={disabled} onClick={handleWrite} className={classes.button}>Write Value to Heart Rate Control Point</button>
            </div>
            <div className={classes.status}>
                <p className={classes.message}>{ message }</p>
            </div>
        </div>
    )

}