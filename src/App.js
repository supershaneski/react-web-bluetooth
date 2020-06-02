import React, { useState } from 'react';
import './App.css';

function base64toHex(encodedValue) {
  let decodedValue = atob(encodedValue);
  let hexString = '';
  
  for(let cChar = 0; cChar < decodedValue.length; cChar++) {
    let hex = '0' + decodedValue.charCodeAt(cChar).toString(16);
    hexString += hex.slice(-2);
  }

  return hexString;
}

function App() {
  const [ devices, setDevices ] = useState([]);
  const [ message, setMessage ] = useState("Ready");
  const [ count, setCount ] = useState(0);
  const [ disabled, setDisabled ] = useState(false);

  async function scanNearbyBluetoothDevices() {

    setDisabled(true);
    setMessage("Scanning...");

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
        setMessage("Stopping scan...");
        scan.stop();
        setDisabled(false);
        setMessage("Stopped."); //scan.active
      }, 60000);

    } catch(error) {
      console.log(error);
      setDisabled(false);
      setMessage("User cancelled...");
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
      
      setCount(devices.length);
      //setMessage("Scanning... " + devices.length + " devices");
      setMessage("Scanning... ");

      return devices;
    })

  }

  const handleOptionClick = (device) => {
    console.log(device)
  }

  return (
    <div className="container">
      <header>
        <h4>Web Bluetooth API Demo</h4>
      </header>
      <div className="control-panel">
        <button disabled={disabled} onClick={scanNearbyBluetoothDevices}>Scan for Bluetooth Devices</button>
      </div>
      <div className="list-panel">
        <select size="5">
        {
          devices.length > 0 && devices.map((device, index) => {
            return (
              <option onClick={() => handleOptionClick(device)} key={index}>{ device.name }</option>
            )
          })  
        }
        </select>
      </div>
      <div className="bottom-panel">
      <div className="status">
        <span>{ message }</span>
        <span>Total: { count } devices</span>
      </div>
      </div>
    </div>
  );
}

export default App;
