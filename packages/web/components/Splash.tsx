import React from "react";
import logo from "./logo.svg";
import "./Splash.css";

const Splash: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
};

export default Splash;
