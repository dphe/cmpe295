function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
        center: {lat: 37.322993, lng: -121.883200},
        zoom: 10
    });
}