// refreshscores.js
// Copyright (c) 2017 Miles Bright, MIT License
// https://github.com/smilesbright/onewordeachbot

'use strict';

const snoowrap = require('snoowrap');
const jsonfile = require('jsonfile');

const requestParameters = {
	client_id: process.env.CLIENTID,
	client_secret: process.env.CLIENTSECRET,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	user_agent: process.env.USERAGENT
};

const request = new snoowrap(requestParameters);


//
// Refresh comment scores in comments.json.
//
jsonfile.readFile('./comments.json', function(err, obj) {

	obj.comments.forEach(function(listing) {
		request.getComment(listing.id).refresh().then(comment => {
			listing.score = comment.score;
			jsonfile.writeFile('./comments.json', obj);
		});
	});

});










