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
	  oldMarkers = L.geoJson(data, {
	  	pointToLayer: function(feature, latlng){
	  		return new L.CircleMarker(latlng)
	  			.setRadius(3)
	  			.setStyle({ color:  'red'})
	  		;
	  	}
	  }).addTo(map);
	});
  }

  window.oldSchools = null;
  function updateSchools(){
	$.getJSON('schooldata.json', function(data){

	  console.log(data);
	  if (oldSchools) map.removeLayer(oldSchools);
	  oldSchools = L.geoJson(data, {
	  	pointToLayer: function(feature, latlng){
	  		return new L.CircleMarker(latlng)
	  			.setRadius(8)
	  			.setStyle({ color:  'black'})
	  		;
	  	}
	  }).addTo(map);
	});
  }

  window.oldRegions = null;
  function updateRegions(){
  	$.ajax({
      type: 'POST',
      url: 'regions.json',
      dataType: 'json',
      data: JSON.stringify(map.getBounds()),
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
        if (oldRegions) map.removeLayer(oldRegions);
         
		oldRegions = new L.GeoJSON(result, {
      onEachFeature: function(feature, layer) {
        // layer.setStyle({ color:  '#003300', weight: 2, fill: true, fillColor: '#009933' });
      },
      pointToLayer: function(feature, latlng) {
        feature.propereties = {
          safetyScore: getRandomInt(30,90),
          speedScore: getRandomInt(10,100),
          infractionScore: getRandomInt(10,100),
          sidewalkScore: getRandomInt(10,100),
          crosswalkScore: getRandomInt(10,100)
        };

        var marker = new L.marker(latlng, {icon: L.divIcon({
          iconSize: null,
          iconAnchor: null,
          popupAnchor: [0,-75],
          className: 'safescore-icon',
          html: feature.propereties.safetyScore
        })});

        var popupContent = 
          '<div class="metric-panel speed"> speed <div class="score">' +feature.propereties.speedScore+ '</div></div>' + 
          '<div class="metric-panel infractions"> infractions <div class="score">' +feature.propereties.infractionScore+ '</div></div>' + 
          '<div class="metric-panel sidewalks"> sidewalks <div class="score">' +feature.propereties.sidewalkScore+ '</div></div>' + 
          '<div class="metric-panel crosswalks"> crosswalks <div class="score">' +feature.propereties.crosswalkScore+ '</div></div>'
        ;

        var popup = new L.Popup({
          className: 'safescore-popup',
          offset: [-50, 70]
        });

        marker.bindPopup(popup.setContent(popupContent));

        return marker;
      }

    });

		map.addLayer(oldRegions);
      },
      error: function (req, status, error) {
        console.error('Unable to get region data');
      }
    });
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateAll(){
  	updateMarkers();
  	updateRegions();
  	updateSchools();
  }

  function pixelsToMeters(pixCount, lat, zoom){
  	return pixCount * 6372.7982 * Math.cos(lat /180 *2 *Math.PI) / Math.pow(2, zoom +8)
  }

  map.on('zoomend', updateMarkers);
  map.on('dragend', updateMarkers);
  map.whenReady(updateAll);
});