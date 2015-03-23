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
	   	
	    var geoJson = new FeatureCollection();
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

server.get('/schooldata.json', function(req,res){
	var conString = "postgres://awsuser:Password@vision-zero.czkztglgrevo.us-west-2.rds.amazonaws.com/vision_zero";
	pg.connect(conString, function(err, client){
	  if (err) return console.error('error fetching client from pool', err);
	  
	  // all data within 0.5 miles
	  var query = 'select ST_AsGeoJSON(wkb_geometry) as geometry from schools';
	  client.query(query, function(err, result) {
	    if (err) return console.error('error running query', err);
	   	
	    var geoJson = new FeatureCollection();
		result.rows.forEach(function(row){
			geoJson.features.push({
        		"type": "Feature",
        		"geometry": JSON.parse(row.geometry)
			});
		});

	    res.json(geoJson);
	    client.end();
	  });
	});
});

server.post('/regions.json', function(req,res){

	var conString = "postgres://awsuser:Password@vision-zero.czkztglgrevo.us-west-2.rds.amazonaws.com/vision_zero";
	pg.connect(conString, function(err, client) {
 		
        var sql = 
        	'select ST_AsGeoJSON(wkb_geometry) as shape ' +
        		'from spd_beats_regions ' // +
        		// 'where wkb_geometry && ST_GeogFromText(\'SRID=4326;POLYGON(($1 $2,$3 $4,$5 $6,$7 $8,$9 $10))\') ' +
        		// 'and ST_Intersects(wkb_geometry, ST_GeogFromText(\'SRID=4326;POLYGON(($11 $12,$13 $14,$15 $16,$17 $18,$19 $20))\'));'
        ;
        	
        var bounds = req.body;
        var vals = [bounds._southWest.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lat, bounds._northEast.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._northEast.lat, bounds._southWest.lng, bounds._southWest.lat];
        var vals = vals.concat(vals);
        
        client.query(sql, /* vals, */ function(err, result) {

        	console.log(err);

            var featureCollection = new FeatureCollection();
            for (i = 0; i < result.rows.length; i++)
                featureCollection.features[i] = JSON.parse(result.rows[i].shape);
 
            res.json(featureCollection);
            client.end();
        });
    });
});

function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = [];
}

var port = process.env.PORT || 3000;
server.listen(port);
console.log(__filename + ' is now listening on port ' + port);


