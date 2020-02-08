import React from 'react';
import { Router } from "@reach/router";
import Analysis2 from "./assets/pages/Analysis";
import Home from "./assets/pages/Home";
import Contact from "./assets/pages/Contact";
import ResponsiveNavegation from "./assets/Components/ResponsiveNavagation"
import logo from './logo.svg';
import './App.css';

function App() {
  const navLinks = [
    {
      text: "Home2",
      path: "/",
      icon: "ion-ios-home"
    },
    {
      text: "Contact",
      path: "/contact",
      icon: "ion-ios-megaphone"
    },
    {
      text: "Analysis",
      path: "/analysis",
      icon: "ion-ios-analytics" 
    }
  ]

  // code bellow to go to different links inside the webpage
  return (
    <div className="App">
      <ResponsiveNavegation
        navLinks={ navLinks }
        logo={ logo }
        // background="#fff"
        // hoverBackground="#ddd"
        // linkColor="#777"
      />
      <div>
        <Router>
          <Home path="/" />
          <Contact path="/contact" />
          <Analysis2 path="/analysis" />
        </Router>
      </div>
    </div>
  );
}

export default App;