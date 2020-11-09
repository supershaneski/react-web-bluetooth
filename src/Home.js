import React from "react";
import { Link } from "react-router-dom";
import classes from './App.module.css';

export default function Home() {
    return (
      <main className={classes.main}>
        <Link className={classes.link} to="/scan"><button className={classes.button}>LE Scan for Advertisement</button></Link>
        <Link className={classes.link} to="/notify"><button className={classes.button}>Read and Write Value using Notification</button></Link>
        <Link className={classes.link} to="/battery"><button className={classes.button}>Read Battery Level from a Bluetooth Device</button></Link>
        <Link className={classes.link} to="/heart"><button className={classes.button}>Write Value to a Bluetooth Device</button></Link>
      </main>
    )
  }
  