import React, { useState } from 'react';
import classes from './ReadBattery.module.css';

export default function ReadBattery() {
    const [ message, setMessage ] = useState("_");

    const handleClick = () => {

        setMessage("_");

        navigator.bluetooth.requestDevice({
            filters: [{
                services: ['battery_service']
            }]
        }).then(device => {
            console.log('Got device:', device.name);
            console.log('id:', device.id);
            return device.gatt.connect(); // Chromium 49 and below use `connectGATT()` but from Chromium 50 it will use gatt.connect();
        })
        .then(server => {
            console.log('Getting Battery Service…');
            return server.getPrimaryService('battery_service');
        })
        .then(service => {
            console.log('Getting Battery Characteristic…');
            return service.getCharacteristic('battery_level');
        })
        .then(characteristic => {
            console.log('Reading battery level…');
            return characteristic.readValue();
        })
        .then(value => {
            value = value.buffer ? value : new DataView(value);
            console.log('Battery percentage:', value.getUint8(0));
            
            //setMessage('Battery percentage: ' + value.getUint8(0));
            setMessage(value.getUint8(0));

        })
        .catch(exception => {
            console.log(exception);
        });
    }

    return (
        <div className={classes.container}>
            <div className={classes.control}>
                <button onClick={handleClick} className={classes.button}>Read Battery Level</button>
            </div>
            <div className={classes.status}>
                
                <div className={classes.display}>
                    <p className={classes.message}>Battery Level:</p>
                    <p className={classes.submessage}>
                        <span className={classes.value}>{message}</span>
                        <span className={classes.unit}>%</span>
                    </p>
                </div>
                
                
            </div>
        </div>
    )
}