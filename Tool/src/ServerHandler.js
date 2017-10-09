import openSocket from "socket.io-client";
import $ from "jquery";
// var tempSocket = openSocket('http://interview.optumsoft.com');
var tempSocket = openSocket("http://interview.optumsoft.com");
console.log("openSocket");
const ServerHandler = context => {
  tempSocket.on("connection", data => {
    console.log("connected");
  });
  var sensorNames;
  var sensorConfig;
  var index = 0;
  $.get(`http://interview.optumsoft.com/sensornames`, function(data) {
    // console.log(data);
    sensorNames = data;
    $.get(`http://interview.optumsoft.com/config`, function(data) {
      // console.log(data);
      sensorConfig = data;
      // console.log('sensor details'+sensorNames,sensorConfig);
      sensorNames.map(name => {
        // var
        console.log('sensorConfig'+sensorConfig[name]);
        context.setState({
          [name]: {
            recent: [],
            minute: [],
            min: sensorConfig[name].min,
            max: sensorConfig[name].max
          }
        });
      });
      sensorNames.map(name => tempSocket.emit("subscribe", name));

      // sensorConfig.map()
    });
  });

  // console.log('current context'+context.state['temperature0']);
  // console.log('sensor details'+context.state.sensorNames,context.sensorConfig);
  // tempSocket.on("data", function(data) {
  //   if (data.type === "init") console.log("inti", data);
  // });
  tempSocket.on("data", function(data) {
    // console.log('data'+key,val,sensor);
    // console.log('currnet state'+context.state.name);
    if (data.type === "init") {
      var { recent, minute } = data;
      var {min,max} = context.state["temperature" + index];
      // console.log('for init,'+sensorVals[min],sensorVals[max]);
      context.setState({
        ["temperature" + index]: {
          recent: recent,
          minute: minute,
          min,
          max
        }
      });
      index++;
    } else {
      var { key, val, sensor, type, scale } = data;
      var sensorVals = context.state[sensor];
      console.log('before updation..all the values'+sensorVals,sensorVals[max]);
      // console.log('sensor values for scale '+scale,sensorVals[scale]);
      var scaleVals = sensorVals[scale];
      // console.log('before change');
      // scaleVals.map(val=>console.log(val.key,val.val));
      if (type === "update") {
        scaleVals.push({
          key,
          val
        });
      } else if (type === "delete") {
        scaleVals = scaleVals.filter(history => history.key !== key);
        // console.log('deleted from '+sensorVals[scale]);
      }
      sensorVals[scale] = scaleVals;
      console.log('after updation..all the values'+sensorVals[min],sensorVals[max]);
      context.setState({
        [sensor]: sensorVals
      });
    }
  });
};

export default ServerHandler;
