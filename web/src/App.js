import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import QRCode from 'qrcode.react';
import * as firebase from "firebase";
import { Data } from "./FirebaseReact";

class App extends Component {

  render() {
    const eventData = {
      id: "12345",
      name: "12345"
    }

    return (
      <div className="App">
        <div className="hero-image">
          <div className="hero-text">
          </div>
        </div>
        <p className="App-intro">
           
          <QRCode size={200} value={JSON.stringify(eventData)} /><br/>
          Check In Here !!!
        </p>
        <p className="App-intro">
        <Data
            path="event/12345/users"
            renderLoading={() => <span>Loading...</span>}
            renderData={v => {
              const count = Object.keys(v || {}).length;
              return (
                <span>{count} check-ins</span>
              );
            }}
          />
           </p>
           <p className="App-intro">
          <Data
            path="event/12345/users"
            renderLoading={() => <span>Loading...</span>}
            renderData={v => {
              var rows = [];
              for (let key in v) {
                  if (v.hasOwnProperty(key)) {
                    rows.push(<span key={v[key].id}>{v[key].name},</span>)
                  }
              }
              return rows;
            }}
          />
          </p>
      </div>
    );
  }
}

export default App;
