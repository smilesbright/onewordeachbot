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

const REMOVAL_AGE = 21;


//
// Run script once per day. Increment age and remove old posts.
//
jsonfile.readFile('./Desktop/onewordeachbot/comments.json', function(err, obj) {

	obj.comments.forEach(function(listing) {
		listing.daysOld ++;
		jsonfile.writeFile('./Desktop/onewordeachbot/comments.json', obj);		
	});
	/*var newJSON = {comments: []};
	newJSON.comments = obj.comments.filter(function(comment) {
		return comment.daysOld < REMOVAL_AGE;
	});
	jsonfile.writeFile('./Desktop/onewordeachbot/comments.json', newJSON);*/
});

