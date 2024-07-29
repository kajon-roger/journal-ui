import React from 'react';
import logo from './logo.svg';
import './App.css';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Journal } from './components/Journal';
import { ComponentToShow, Discovery, toComponentsToShow } from './components/Discovery';
import { View } from './modules/IViewSwitcher';

function getQueryVariable(paramName: string): string {

  let paramValue: string = "";
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let [name, value] = vars[i].split("=");
    if (name === paramName) {
      paramValue = value;
    }
  }
  return paramValue;
}

function App() {
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
  // Launch app in component discovery mode by adding /discovery to the URL path

  let getQueryVariable = (paramName: string): string => {

    let paramValue: string = "";
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let [name, value] = vars[i].split("=");
      if (name === paramName) {
        paramValue = value;
      }
    }
    return paramValue;
  }
  
  const isDiscovery: boolean = window.location.pathname.replace(/\//g, '') === 'discovery';

  let getDiscovery = () => {

    return (
      <div className="App">
        <Discovery />
      </div>
    )
  }

  if (isDiscovery) {

    return (
      getDiscovery()
    )
  } else {
    return (
      <Journal initialView={View.TASKS}></Journal>
    );
  }
}

export default App;
