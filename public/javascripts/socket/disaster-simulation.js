/**
 * Created by dhanyapai on 10/9/16.
 */
var socket ;
var socket_uri = "http://localhost:5006";

$(function () {
    socket = io.connect(socket_uri);
    console.log("Socket initialized");
    
    socket.on('saved-warning', function(data) {
        console.log("Received 'saved-warning", data);
        $("#disaster-alert").modal();
        document.getElementById("disaster-place").innerHTML = data.message;
        document.getElementById("disaster-type").innerHTML = data.message;
        
    })
})
function sendAlert() {

    socket.emit('disaster-warning', {type:'EarthQuake', place:'San Jose'});
    console.log("Alert submitted");


    // socket.emit('call', {type:'EarthQuake', place:'San Jose'}, function(resp, data) {
    //     console.log("Server sent a response code" + resp);
    // });


}