// tracknewcomments.js
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
// This method checks text for punctuation that ends a sentence.
//
function hasPunctuation(text) {

	while (text[text.length - 1] === ' ') {
	text = text.slice(0, text.length - 1);
	}
	var c = text[text.length - 1];
	if (c == '.' || c == '?' || c == '!') {
		return true;
	}
	else {
		return false;
	}
}


//
// This script requests new comments from /r/onewordeach and adds comments with
// punctuation to comments.json data storage file to be tracked.
//
jsonfile.readFile('./comments.json', function(err, obj) {

	request.getNewComments('onewordeach').then(function(newComments) {
		// go through the list of new comments
		newComments.forEach(function(newComment) {
			// if comment has a punctuation
			if (hasPunctuation(newComment.body)) {
				// if it's not already in comments list
				var hasBeenAdded = 0;
				obj.comments.forEach(function(commentListing) {
					if (commentListing.id == newComment.id) {
						hasBeenAdded = 1;
					}
				});
				if (hasBeenAdded == 0) {
					// and if its thread doesn't already have a comment from bot
					var addNewComment = true;
					for (var j=0; j < obj.comments.length; j++) {
						if (obj.comments[j].thread == newComment.link_id && obj.comments[j].hasposted == 1) {
							addNewComment = false;
						}
						//console.log(obj.comments[j].thread);
					}
					if (addNewComment == true) {
						// add new comment to list.
						var newComment = {id: newComment.id, thread: newComment.link_id,
							hasposted: 0, daysOld: 0, score: newComment.score};
						obj.comments.push(newComment);
						jsonfile.writeFile('./comments.json', obj); // < completely rewrites entire json file.
					}
				}
			}
		});
	});

});

