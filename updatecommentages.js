// updatecommentages.js
// Copyright (c) 2017 Miles Bright, MIT License
// https://github.com/smilesbright/onewordeachbot

'use strict';

const jsonfile = require('jsonfile');

const REMOVAL_AGE = 7;


// Run script once per day. Increment age and remove old comments
jsonfile.readFile('./comments.json', function(err, obj) {
    // update comment ages and count how many to remove
    var numberToSplice = 0;
	obj.comments.forEach(function(listing) {
		listing.daysOld ++;
        if (listing.daysOld > REMOVAL_AGE) {
            numberToSplice ++;
        }
		// jsonfile.writeFile('./comments.json', obj);		
	});
    if (numberToSplice > 0) {
        obj.comments.splice(0, numberToSplice);
    }
    jsonfile.writeFile('./comments.json', obj);
});

