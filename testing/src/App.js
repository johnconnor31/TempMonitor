import React, { Component } from "react";
import Chart from "chart.js";
import logo from "./logo.svg";
import "./App.css";
import ServerHandler from "./ServerHandler";
class App extends Component {
  constructor() {
    super();
    this.state = {
      option: "temperature0",
      scale: "scale"
    };
    ServerHandler(this);
  }

  componentDidMount() {
    var ctx = document.getElementById("myChart").getContext("2d");
    // var sensorVals = this.state['temperature0']['recent'];
    // console.log('in main app'+ sensorVals);

    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      // var sensorVals = this.state['temperature0'];
      // var xaxis =  this.state['times'];
      // xaxis.map((val))
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [0, 10, 5, 2, 20, 30, 45]
          }
        ]
      },

      // Configuration options go here
      options: {}
    });
  }
  componentWillUpdate(nextProps, nextState) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var currentSensor = this.state.option;
    var scale = this.state.scale;
    // console.log("current sensor:" + currentSensor);
    var sensorVals = nextState[currentSensor];
    // var recentVals = sensorVals['recent'];
    // for(var key in sensorVals){
    //   console.log('sensorVals property'+key);
    // }
    // var minuteVals = sensorVals['minute'];
    // console.log('in main app'+ sensorVals['recent']);

    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",

      // The data for our dataset
      // var sensorVals = this.state['temperature0'];
      // var xaxis =  this.state['times'];
      // xaxis.map((val))
      data: {
        labels:
          sensorVals[scale] !== undefined
            ? sensorVals[scale].map(val => val.key)
            : [],
        datasets: [
          {
            label: currentSensor,
            backgroundColor: "rgb(255,255, 255)",
            borderColor: "green",
            data:
              sensorVals[scale] !== undefined
                ? sensorVals[scale].map(val => val.val)
                : []
          }
        ]
      },

      // Configuration options go here
      options: {
        // showLines:false,
        animation: {
          duration: 0
        }
      }
    });
  }
  onOptionChange(e) {
    console.log("option change to " + e.target.value);
    this.setState({ option: e.target.value });
  }
  onScaleChange(e) {
    this.setState({
      scale: e.target.value
    });
  }
  render() {
    var options = [];
    for (var key in this.state) {
      if (key !== "sensor" && key !== "option")
        options.push(
          <option key={key} value={key}>
            {key}
          </option>
        );
    }
    // var options = this.state.map();

    return (
      <div>
        <div style={{ width: "550px", height: "300px" }}>
          <canvas id="myChart" width="20" height="20" />
        </div>
        <div style={{ float: "right" }}>
          <select
            onChange={this.onOptionChange.bind(this)}
            value={this.state.option}
          >
            {options}
          </select>
          <div>
            <form>
              <input
                type="radio"
                value="recent"
                checked={this.state.scale === "recent"}
                onChange={this.onScaleChange.bind(this)}
              />recent
              <input
                type="radio"
                value="minute"
                checked={this.state.scale === "minute"}
                onChange={this.onScaleChange.bind(this)}
              />minute
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
