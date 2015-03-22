var path = require('path');
var http = require('http');
var express = require('express');
var pg = require('pg');

var server = express()
	.use(express.static(__dirname + '/www'))
	.use(express.static(__dirname + '/bower_components'))
	.use(express.bodyParser())

server.get('/crashdata.json', function(req,res){
	if (!req.query.lng || !req.query.lat) return console.error('lat & lng required');

	var conString = "postgres://awsuser:Password@vision-zero.czkztglgrevo.us-west-2.rds.amazonaws.com/vision_zero";
	pg.connect(conString, function(err, client){
	  if (err) return console.error('error fetching client from pool', err);
	  
	  // all data within 0.5 miles
	  var query = 'select ST_AsGeoJSON(wkb_geometry) as geometry from collision_data where ST_Distance_Sphere(wkb_geometry, ST_MakePoint($1,$2)) <= 0.5 * 1609.34';
	  client.query(query, [req.query.lng,req.query.lat], function(err, result) {
	    if (err) return console.error('error running query', err);
	   	
	    var geoJson = {
		    type: "FeatureCollection",
		    features: []
		}

		result.rows.forEach(function(row){
			geoJson.features.push({
        		"type": "Feature",
        		"properties": {
           			"weather_condition": row.weather_condition,
            		"lighting_condition": row.lighting_condition,
        		},
        		"geometry": JSON.parse(row.geometry)
			});
		});

	    res.json(geoJson);
	    client.end();
	  });
	});
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log(__filename + ' is now listening on port ' + port);


