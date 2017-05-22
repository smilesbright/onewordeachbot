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
jsonfile.readFile('./Desktop/onewordeachbot/comments.json', function(err, obj) {

	obj.comments.forEach(function(listing) {
		request.getComment(listing.id).refresh().then(comment => {
			listing.score = comment.score;
			jsonfile.writeFile('./Desktop/onewordeachbot/comments.json', obj);
		});
	});

});










