$(function(){

  window.map = L.map('map').setView([47.6097, -122.3331], 16);

  L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    subdomains: '1234',
  }).addTo(map);

  window.oldMarkers = null;
  function updateMarkers(){
  	var center = map.getCenter();
  	var zoom = map.getZoom();
  	var mapWidth = map.getBounds()._northEast.lng - map.getBounds()._southWest.lng;

	$.getJSON('crashdata.json?lng=' + center.lng + '&lat=' + center.lat, function(data){
	  if (oldMarkers) map.removeLayer(oldMarkers);
	  oldMarkers = L.geoJson(data).addTo(map);
	});
  }

  window.oldRegions = null;
  function updateRegions(){
  	$.ajax({
      type: 'POST',
      url: '/regions.json',
      dataType: 'json',
      data: JSON.stringify(map.getBounds()),
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
      	console.log(result);
        if (oldRegions) map.removeLayer(oldRegions);
         
		oldRegions = new L.GeoJSON();
		oldRegions.on('featureparse', function(e) {
			e.layer.setStyle({ color:  '#003300', weight: 2, fill: true, fillColor: '#009933' });
		});
		oldRegions.addData(result);
		map.addLayer(oldRegions);
      },
      error: function (req, status, error) {
        console.error('Unable to get region data');
      }
    });
  }

  function updateAll(){
  	updateMarkers();
  	updateRegions();
  }

  map.on('zoomend', updateMarkers);
  map.on('dragend', updateMarkers);
  map.whenReady(updateAll);
});