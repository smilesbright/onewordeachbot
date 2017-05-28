// updatecommentages.js
// Copyright (c) 2017 Miles Bright, MIT License
// https://github.com/smilesbright/onewordeachbot

'use strict';

const jsonfile = require('jsonfile');


//
// Run script once per day to increment comment ages.
//
jsonfile.readFile('./comments.json', function(err, obj) {

	obj.comments.forEach(function(listing) {
		listing.daysOld ++;
		jsonfile.writeFile('./comments.json', obj);		
	});
});

