import React, { useState } from 'react';
import classes from './LEScan.module.css';

function base64toHex(encodedValue) {
    let decodedValue = atob(encodedValue);
    let hexString = '';
    
    for(let cChar = 0; cChar < decodedValue.length; cChar++) {
      let hex = '0' + decodedValue.charCodeAt(cChar).toString(16);
      hexString += hex.slice(-2);
    }
  
    return hexString;
}
  
export default function LEScan() {

    const [ status, setStatus ] = useState("Ready");
    const [ devices, setDevices ] = useState([]);
    const [ disabled, setDisabled ] = useState(false);
    
    async function scanNearbyBluetoothDevices() {

        setDevices([]);

        setStatus("Scanning...");
        setDisabled(true);
    
        const options = {
          acceptAllAdvertisements: true,
          keepRepeatedDevices: true,
          acceptAllDevices: true,
        }
    
        try {
          const scan = await navigator.bluetooth.requestLEScan(options);
          
          console.log("Scanning...");
          console.log(' acceptAllAdvertisements: ' + scan.acceptAllAdvertisements);
          console.log(' active: ' + scan.active);
          console.log(' keepRepeatedDevices: ' + scan.keepRepeatedDevices);
          console.log(' filters: ' + JSON.stringify(scan.filters));
    
          navigator.bluetooth.addEventListener('advertisementreceived', event => {
            
            console.log('Advertisement received.');
            console.log('  Device Name: ' + event.device.name);
            console.log('  Device ID: ' + event.device.id);
            console.log('  RSSI: ' + event.rssi);
            console.log('  TX Power: ' + event.txPower);
            console.log('  UUIDs: ' + event.uuids);
    
            event.manufacturerData.forEach((valueDataView, key) => {
              logDataView('Manufacturer', key, valueDataView);
            });
    
            event.serviceData.forEach((valueDataView, key) => {
              logDataView('Service', key, valueDataView);
            });
    
            addDevice(event);

          });
    
          setTimeout(() => {
            
            setStatus("Stopping scan...");
            
            scan.stop();

            setStatus("Finished"); //scan.active
            setDisabled(false);
            
        }, 5000); // increase this value to scan longer
    
        } catch(error) {
          console.log(error);

          setStatus("User cancelled");
          setDisabled(false);

        }
    
    }

    const logDataView = (labelOfDataSource, key, valueDataView) => {
        const hexString = [...new Uint8Array(valueDataView.buffer)].map(b => {
          return b.toString(16).padStart(2, '0');
        }).join(' ');
        const textDecoder = new TextDecoder('ascii');
        const asciiString = textDecoder.decode(valueDataView.buffer);
        console.log(`  ${labelOfDataSource} Data: ` + key +
            '\n    (Hex) ' + hexString +
            '\n    (ASCII) ' + asciiString);
    };

    const handleScan = () => {
        scanNearbyBluetoothDevices();
    }

    const addDevice = (event) => {
        const hexId = base64toHex(event.device.id);
        const name = event.device.name;
        const newDevice = {
          id: event.device.id,
          name: name || `Unnamed device (${hexId})`,
          event,
        }
        
        setDevices(devices => {
          
          if(devices.some(device => {
            return device.id === newDevice.id
          })) {
            //
          } else {
            devices = devices.concat(newDevice);
          }
          
          setStatus("Scanning... ");
    
          return devices;
        })
    
    }

    return (
        <div className={classes.container}>
            <div className={classes.control}>
                <button disabled={disabled} onClick={handleScan} className={classes.button}>Scan for Devices</button>
            </div>
            <div className={classes.status}>
                <p>{ status }</p>
            </div>
            <div className={classes.list}>
            <select size={5}>
            {
                devices.length > 0 && devices.map((item, index) => {
                    return (
                        <option>{item.name}</option>
                    )
                })
            }
            </select>
            </div>
        </div>
    )
}