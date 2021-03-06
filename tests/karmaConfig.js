module.exports = function(config) {config.set({
	"reporters":["junit","coverage"],
	"browsers":["PhantomJS"],
	"singleRun":true,
	"logLevel":"info",
	"coverageReporter":{
		"type":"html",
		"dir":"coverage"
	},
	"preprocessors":{
		"../src/flexpager.js":["coverage"]	
	},
	"files":[
		"http://code.jquery.com/jquery-1.10.1.min.js",
		"../bin/dust.js",
		"flexpager.dust.js",
		"../src/flexpager.css",
		"../src/flexpager.js",
		"tests.js"
	],
	"frameworks":["qunit"]
});};