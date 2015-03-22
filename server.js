var path = require('path');
var http = require('http');
var express = require('express');

var server = express()
	.use(express.static(__dirname + '/www'))
	.use(express.static(__dirname + '/bower_components'))
	.use(express.bodyParser())

var fakeData = {
	"type": "FeatureCollection",
	"crs": {
	    "type": "name",
	    "properties": {
	        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
	    }
	},
	"features": [{
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Overcast",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.3687473899999, 47.67381616900008]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Dark - Street Lights On"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.32348092899991, 47.637531713000044]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.39287315199994, 47.668660524000074]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Overcast",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.36099416999991, 47.68179741800009]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Raining",
	        "lighting_condition": "Dark - Street Lights On"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.3448083539999, 47.614710262000074]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Raining",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.33716242999992, 47.60235325700006]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Dark - Street Lights On"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.31563384899994, 47.619951977000085]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.33748095199991, 47.61682684500005]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Raining",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.3400282589999, 47.60882663700005]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Overcast",
	        "lighting_condition": "Dark - Street Lights On"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.33285960599994, 47.60266701300009]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.38760217399994, 47.67019286900006]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Unknown",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.33017730199992, 47.661374812000076]
	    }
	}, {
	    "type": "Feature",
	    "properties": {
	        "weather_condition": "Clear or Partly Cloudy",
	        "lighting_condition": "Daylight"
	    },
	    "geometry": {
	        "type": "Point",
	        "coordinates": [-122.33957314499992, 47.608329076000075]
	    }
	}]
};

server.get('/crashdata.json', function(req,res){

	res.json(fakeData);
	
});

var port = process.env.PORT || 3000;
server.listen(port);
console.log(__filename + ' is now listening on port ' + port);


