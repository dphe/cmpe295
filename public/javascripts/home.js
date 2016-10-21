function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 37.322993, lng: -121.883200},
    zoom: 10
  });
}

$(function () {
  $.ajax({
    type: 'GET',
    contentType: 'json',
    url: "/fetchDatacenters",
    success: function (data) {
      //console.log('success',data);
      if (data) {
        var len = data.length;
        var table_content = "";
        if (len > 0) {
          for (var i = 0; i < len; i++) {
            table_content += "<tr><td>" + data[i]._id +
              "</td><td>" + data[i]['location-id'] +
              "</td><td>" + data[i].capacity +
              "</td><td>" + data[i].status +
              "</td><td>" + data[i]['storage-use'] +
              "</td><td>" + data[i]['storage-free'] + "</td></tr>";
          }
          if (table_content != " ") {
            $("#datacenter_table").append(table_content);
          }
        }

      }
    },
    error: function (e) {
      console.log(e);
    }
  });
});

$(document).ready(function () {

  $('#simulatorSubmitButton').on('click', function () {

    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/"
      + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();

    if($("#disasterLoc").val() == 'other'){
      var latitude = $('#simulatorLatitude').val();
      var longitude =   $('#simulatorLongitude').val();
    }
    disasterInfo={
      "disasterName":$("#disasterType").val(),
      "disasterLocation":$("#disasterLoc").val(),
      "disasterLatitude": latitude,
      "disasterLongitude": longitude,
      "disasterTime": datetime,
      "disasterTimeZone":currentdate.toString().split("GMT")[1]
    }

    $.ajax({
      type: 'POST',
      data:disasterInfo,
      url: "/createDisasterEvent",
      success: function (data) {
        alert("Disaster Event Created");
        $('#simulatorLatitude').val('');
        $('#simulatorLongitude').val('');
        $('#disasterType').prop('selectedIndex',0);
        $('#disasterLoc').prop('selectedIndex',0);

      },
      error: function (e) {
        console.log(e);
      }
    });

  });
  $("#disasterLoc").on('change',function(){

    //
    if($("#disasterLoc").val()=="other"){
      $('#simulatorOtherOptions').show();
    }else{
      $('#simulatorOtherOptions').hide();
    }
  });

});




