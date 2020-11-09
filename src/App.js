import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  //Route,
  Link
} from "react-router-dom";
import classes from './App.module.css';
import Routes from './Routes';
import PreloadComponents from './PreloadComponents';

//import Home from './Home';
//import LEScan from './components/LEScan';
//import ReadBattery from './components/ReadBattery';
//import WriteHeart from './components/WriteHeart';
//import Notification from './components/Notification';

/*
function Home() {
  return (
    <main className={classes.main}>
      <Link className={classes.link} to="/scan"><button className={classes.button}>LE Scan for Advertisement</button></Link>
      <Link className={classes.link} to="/notify"><button className={classes.button}>Read and Write Value using Notification</button></Link>
      <Link className={classes.link} to="/battery"><button className={classes.button}>Read Battery Level from a Bluetooth Device</button></Link>
      <Link className={classes.link} to="/heart"><button className={classes.button}>Write Value to a Bluetooth Device</button></Link>
    </main>
  )
}
...
<Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/scan' component={LEScan} />
              <Route exact path='/battery' component={ReadBattery} />
              <Route exact path='/heart' component={WriteHeart} />
              <Route exact path='/notify' component={Notification} />
          </Switch>
*/

function App() {
  
  return (
    <Router>
      <div className={classes.container}>
        <div className={classes.header}>
          <Link className={classes.toplink} to='/'><h4 className={classes.title}>Web Bluetooth API Demo</h4></Link>
        </div>
        <React.Suspense fallback={<span>Loading....</span>}>
          <PreloadComponents />
          <Switch>
              <Routes />
          </Switch>
        </React.Suspense>
      </div>
    </Router>
  )

}

export default App;
