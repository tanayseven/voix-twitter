// var changeColor = function (str) {
//   var diff = -6;
//   var tmp = str.slice(0,str.length/2);
//   var start = '0';
//   var end = 'F';
//   var char = (str[str.length/2].charCodeAt(0) === start.charCodeAt(0))?
//             end.charCodeAt(0)+diff:
//             str[str.length/2].charCodeAt(0)+diff;
//   return tmp+String.fromCharCode(char);
// };

$(document).ready(function(){
  var ctx = $("#pollChart")[0].getContext("2d");
  var socket = io.connect(/*window.location.hostname*/);
  socket.on('status',function (msg) {
    if(msg.connected) {
      socket.emit('register',{username:'anonymous'});
    }
  });
  socket.on('tweet', function(tweet) {
    console.log(JSON.stringify(tweet));
  });

  var options = {
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke : true,

      //String - The colour of each segment stroke
      segmentStrokeColor : "#fff",

      //Number - The width of each segment stroke
      segmentStrokeWidth : 2,

      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout : 0, // This is 0 for Pie charts

      //Number - Amount of animation steps
      animationSteps : 100,

      //String - Animation easing effect
      animationEasing : "easeOutBounce",

      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,

      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : false,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

  }

  var color_arr = [
    '#0000FF','#8A2BE2','#A52A2A',"#F7464A",'#00FFFF',"#46BFBD","#5AD3D1",'#F0F8FF',"#FF5A5E",'#7FFFD4','#F0FFFF','#FFE4C4','#7FFF00','#DC143C','#006400','#FF8C00','#9932CC','#FF1493'
  ];

  var data = [] ; /*[
      {
          value: res.votes[0].count,
          color:"#F7464A",
          highlight: "#FF5A5E",
          label: res.votes[0].name
      },
      {
          value: res.votes[1].count,
          color: "#46BFBD",
          highlight: "#5AD3D1",
          label: res.votes[1].name
      },
      {
          value: res.votes[2].count,
          color: "#FDB45C",
          highlight: "#FFC870",
          label: res.votes[2].name
      }
  ];*/


  // for (var i = 0 ; i < res.votes.length ; ++i) {
  //   data.push({value:res.votes[i].count,color:color_arr[i],highlight:color_arr[(i+3)*2],label:res.votes[i].name});
  // }

  var myPieChart = new Chart(ctx).Pie(data,options);
});
