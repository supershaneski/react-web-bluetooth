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

  async function scanNearbyBluetoothDevices() {

    setMessage("Scanning...");

    const options = {
      acceptAllAdvertisements: true,
      keepRepeatedDevices: true,
      acceptAllDevices: true,
    }

    try {
      const scan = await navigator.bluetooth.requestLEScan(options);
      console.log(scan);
    } catch(error) {
      console.log(error);
      setMessage("User cancelled...");
    }

    navigator.bluetooth.addEventListener('advertisementreceived', event => {
      addDevice(event);
    });
    

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
        <button onClick={scanNearbyBluetoothDevices}>Scan for Bluetooth Devices</button>
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
      <div className="status">{ message }</div>
      </div>
    </div>
  );
}

export default App;
