$(function(){

  var map = L.map('map').setView([51.505, -0.09], 13);

  var googleLayer = new L.Google('ROADMAP');
  map.addLayer(googleLayer);

});