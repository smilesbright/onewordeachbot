// stickylatestpost.js
// Copyright (c) 2017 Miles Bright, MIT License
// https://github.com/smilesbright/onewordeachbot

'use strict';

const snoowrap = require('snoowrap');

const requestParameters = {
	client_id: process.env.CLIENTID,
	client_secret: process.env.CLIENTSECRET,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	user_agent: process.env.USERAGENT
};

const request = new snoowrap(requestParameters);


request.getUser('onewordeachbot').getComments().then(function(botComments) {

	if (botComments[0].stickied == false && botComments[0].body[0] === '[') {
		botComments[0].distinguish({status: true, sticky: true});
	}
});

