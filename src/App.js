import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);

    this.messageHandler = this.messageHandler.bind(this);
    this.getPercentChanges = this.getPercentChanges.bind(this);

    this.state = {
      eth: {
        price: 0.00
      },
      btc: {
        price: 0.00
      }
    }

    this.subscription = {
      "type": "subscribe",
      "product_ids": ["ETH-USD", "BTC-USD"],
      "channels": ["ticker"]
    }

    var ws = new WebSocket('wss://ws-feed.gdax.com');

    ws.onopen = () => {
      ws.send(JSON.stringify(this.subscription));
    };

    ws.onmessage = this.messageHandler;
    this.getPercentChanges();

    setInterval(this.getPercentChanges, 1000 * 60);
  }

  messageHandler(response) {
    var data = JSON.parse(response.data);

    if (data.product_id === 'ETH-USD') {
      var eth = {...this.state.eth};
      eth.price = Number.parseFloat(data.price).toFixed(2);
      this.setState({eth});
    }
    else if (data.product_id === 'BTC-USD') {
      var btc = {...this.state.btc};
      btc.price = Number.parseFloat(data.price).toFixed(2);
      this.setState({btc});
    }
  }

  getPercentChanges() {
    console.log("GetPercentChanges");

    axios.get("https://api.coinmarketcap.com/v1/ticker/ethereum/")
         .then(res => {

            var eth = {...this.state.eth};
            eth.percent_change_1h = res.data[0].percent_change_1h;
            eth.percent_change_24h = res.data[0].percent_change_24h;
            eth.percent_change_7d = res.data[0].percent_change_7d;
            this.setState({eth});
         })
         .catch(err => {
           console.error(err);
         });

    axios.get("https://api.coinmarketcap.com/v1/ticker/bitcoin/")
         .then(res => {
            var btc = {...this.state.btc};
            btc.percent_change_1h = res.data[0].percent_change_1h;
            btc.percent_change_24h = res.data[0].percent_change_24h;
            btc.percent_change_7d = res.data[0].percent_change_7d;
            this.setState({btc});
         })
         .catch(err => {
           console.error(err);
         });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header text-center">
                <h3>ETH-USD</h3>
              </div>
              <div className="card-body text-center">
                <h1>${this.state.eth.price}</h1>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Change  1H <div className="float-right"><span className={
                  this.state.eth.percent_change_1h > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.eth.percent_change_1h}%</span></div></li>
                <li className="list-group-item">Change 24H <div className="float-right"><span className={
                  this.state.eth.percent_change_24h > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.eth.percent_change_24h}%</span></div></li>
                <li className="list-group-item">Change  7D <div className="float-right"><span className={
                  this.state.eth.percent_change_7d > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.eth.percent_change_7d}%</span></div></li>
              </ul>
            </div>
          </div>
          <div className="col">
          <div className="card">
              <div className="card-header text-center">
                <h3>BTC-USD</h3>
              </div>
              <div className="card-body text-center">
                <h1>${this.state.btc.price}</h1>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Change  1H <div className="float-right"><span className={
                  this.state.btc.percent_change_1h > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.btc.percent_change_1h}%</span></div></li>
                <li className="list-group-item">Change 24H <div className="float-right"><span className={
                  this.state.btc.percent_change_24h > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.btc.percent_change_24h}%</span></div></li>
                <li className="list-group-item">Change  7D <div className="float-right"><span className={
                  this.state.btc.percent_change_7d > 0 ? "badge badge-success" : "badge badge-danger"
                }>{this.state.btc.percent_change_7d}%</span></div></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
