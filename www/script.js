$(function(){

  var map = L.map('map').setView([47.6097, -122.3331], 13);

  L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    subdomains: '1234',
  }).addTo(map);

  L.geoJson(collisionData).addTo(map);

});