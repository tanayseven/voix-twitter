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
  // var doc = {"_id":"5644e0992fec07254f6ca573","end_time":"2015-11-13T18:55:21.277Z","start_time":"2015-11-07T18:55:21.277Z","poll_name":" Who really won the Bihar election","poll_keywords":["Bihar","election"],"votes":[{"name":"congress","tags":["congress"],"count":0},{"name":"bjp","tags":["bjp"],"count":0},{"name":"jdu","tags":["jdu"],"count":0}],"tweets":[],"success":true,"username":"","email":"","filename":"views/poll.hbs","data":true,"blockParams":[],"knownHelpers":{"helperMissing":true,"blockHelperMissing":true,"each":true,"if":true,"unless":true,"with":true,"log":true,"lookup":true}};
  var myPieChart = null;
  var color_arr = [
    '#0000FF','#8A2BE2','#A52A2A',"#F7464A",'#00FFFF',"#46BFBD","#5AD3D1",'#F0F8FF',"#FF5A5E",'#7FFFD4','#F0FFFF','#FFE4C4','#7FFF00','#DC143C','#006400','#FF8C00','#9932CC','#FF1493'
  ];
  var options = {
      segmentShowStroke : true,
      segmentStrokeColor : "#fff",
      segmentStrokeWidth : 2,
      percentageInnerCutout : 0,
      animationSteps : 100,
      animationEasing : "easeOutBounce",
      animateRotate : true,
      animateScale : false,
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  }
  var processTweet = function (tweet) {

  };
  var initial = false;
  var ctx = $("#pollChart")[0].getContext("2d");
  var socket = io.connect(/*window.location.hostname*/);
  socket.on('status',function (msg) {
    if(msg.connected) {
      socket.emit('register',{username:'anonymous'});
      var data = [];
      for (var i = 0 ; i < doc.votes.length ; ++i) {
        console.log(doc.votes[i].name+' '+doc.votes[i].count);
        data.push({value:doc.votes[i].count,color:color_arr[i],highlight:color_arr[(i+2)*2],label:doc.votes[i].name});
      }
      // console.log(JSON.stringify(data)+' '+JSON.stringify(options));
      console.log(ctx);
      myPieChart = new Chart(ctx).Pie(data,options);
    }
  });
  var updateChart = function() {
    for (var i = 0 ; i < doc.votes.length ; ++i) {
      console.log(doc.votes[i].name+' '+doc.votes[i].count);
      data.push({value:doc.votes[i].count,color:color_arr[i],highlight:color_arr[(i+2)*2],label:doc.votes[i].name});
    }
  }
  socket.on('tweet', function(tweet) {
    // console.log(JSON.stringify(tweet));
  });
});
