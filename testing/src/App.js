import React, { Component } from "react";
import $ from "jquery";
import Chart from "chart.js";
import logo from "./logo.svg";
import "./App.css";
import ServerHandler from "./ServerHandler";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: ["temperature0"],
      scale: "recent",
      colorSet: [
        "green",
        "orange",
        "black",
        "blue",
        "yellow",
        "brown",
        "violet",
        "indigo",
        "purple",
        "magenta"
      ]
    };
    ServerHandler(this);
    this.emptyChart();
  }
  emptyChart(){
      Chart.plugins.register({
  afterDraw: function(chart) {
    if (chart.data.datasets.length === 0) {
      // No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height
      chart.clear();
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText('No data to display', width / 2, height / 2);
      ctx.restore();
    }
  }
});
  }
  componentDidMount() {
    // console.log(this.state);
    // this.paintChart(this.state);
    var ctx = document.getElementById("myChart").getContext("2d");
    var chart = new Chart(ctx, {
      type: "line"
    });
  }
  componentWillUpdate(nextProps, nextState) {
    this.paintChart(nextState);
  }

  paintChart(state) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var currentSensors = state.selected;
    var scale = state.scale;
    var multiId = 0;
    // console.log("current sensor:" + currentSensor);
    var sensorVals = currentSensors.map(val => state[val]);
    // console.log('filtered sensors'+sensorVals);
    function pointColorSet(a){
      // console.log('change color'+a);
      var data = a[scale];
      var {min,max} = a; 
      console.log('min'+min,'max'+max);
      return data.map(val=>(val.val<min)||(val.val>max)?'red':'green');
    }
    var data = sensorVals
      ? sensorVals.map(sensorData => {
          return {
            label: currentSensors[multiId],
            // backgroundColor: "rgb(255,255, 255)",
            borderColor: this.state.colorSet[multiId],
            pointBackgroundColor: pointColorSet(sensorVals[multiId]),
            pointStyle : 'rect',
            radius: 5,
            // borderWidth: "0.8px",
            data: sensorVals[multiId++][scale].map(val => val.val)
            }
          })
      : [];
    var labels = sensorVals[0] ? sensorVals[0][scale].map(val => val.key) : [];
    // console.log('lables'+labels);
    // var recentVals = sensorVals['recent'];
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
        labels: labels,
        datasets: data,
      },
        // Configuration options go here
        options: {
          title: {
            display: true,
            text: 'Real-time Sensor Data',
            fontsize:'40px'
          },
          elements: {
            line: {
              tension: 0 // disables bezier curves
            }
          },
          animation: {
            duration: 0
          },
        }
    });
    // console.log('chart'+Object.keys(chart));
    
  }
  onOptionChange(e, index, vals) {
    // console.log("option change to " + vals);
    this.setState({ selected: vals });
  }
  onScaleChange(e) {
    this.setState({
      scale: e.target.value
    });
  }

  render() {
    var optList = [];
    var selected = this.state.selected;
    for (var key in this.state) {
      if (
        key !== "sensor" &&
        key !== "selected" &&
        key !== "scale" &&
        key !== "colorSet"
      )
        optList.push(
          <MenuItem
            key={key}
            insetChildren={true}
            checked={selected && selected.indexOf(key) > -1}
            value={key}
            primaryText={key}
          />
        );
      // console.log('option jsx'+optList);
    }
    // var options = this.state.map();

    return (
      <div>
          
      <canvas id="myChart" width='800px' height='300px' />
        
        <div style={{ float: "left" }}>
          <MuiThemeProvider>
          <SelectField
              multiple={true}
              hintText="Select a Sensor"
              value={selected}
              onChange={this.onOptionChange.bind(this)}
            >
              {optList}
            </SelectField>
          </MuiThemeProvider>
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
