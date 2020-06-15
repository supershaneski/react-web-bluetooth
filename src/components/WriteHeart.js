import React, { useState } from 'react';
import classes from './WriteHeart.module.css';

export default function WriteHeart() {
    const [ message, setMessage ] = useState("Ready");


    const handleClick = () => {

        setMessage("Scanning...");

        navigator.bluetooth.requestDevice({
            filters: [{
                services: ['heart_rate']
            }]
        }).then(device => {

            setMessage("Connected...");

            console.log('Got device:', device.name);
            console.log('id:', device.id);
            return device.gatt.connect();
        })
        .then(server => server.getPrimaryService('heart_rate'))
        .then(service => service.getCharacteristic('heart_rate_control_point'))
        .then(characteristic => {
            
            console.log('Try writing value')
            setMessage("Attempting to write...");

            // this value will be written
            const _value = 1;

            //const resetEnergyExpended = new Uint8Array([1]);
            const resetEnergyExpended = new Uint8Array([_value]);
            // A value of `1` is a signal to reset it.
            return characteristic.writeValue(resetEnergyExpended);
        })
        .then(value => {
            console.log('Reset value of energy expended field');

            setMessage("Value is successfully written.")
        })
        .catch(exception => {
            setMessage("User cancelled");
            console.log(exception);
        });

    }

    return (
        <div className={classes.container}>
            <div className={classes.control}>
                <button onClick={handleClick} className={classes.button}>Write Heart Rate Control Point</button>
            </div>
            <div className={classes.status}>
                <p>{ message }</p>
            </div>
        </div>
    )

}