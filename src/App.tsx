import React from 'react';
import './App.css';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Journal } from './components/Journal';
import { Discovery } from './components/Discovery';
import { View } from './modules/IViewSwitcher';


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
