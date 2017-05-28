// checkscoresnpost.js
// Copyright (c) 2017 Miles Bright, MIT License
// https://github.com/smilesbright/onewordeachbot

'use strict';

const snoowrap = require('snoowrap');
const jsonfile = require('jsonfile');
const textToImage = require('text-to-image');
const imgur = require('imgur-node-api');
const find = require('find');
const fs = require('fs');


const requestParameters = {
	client_id: process.env.CLIENTID,
	client_secret: process.env.CLIENTSECRET,
	username: process.env.USERNAME,
	password: process.env.PASSWORD,
	user_agent: process.env.USERAGENT
};

imgur.setClientID(process.env.IMGURID);

const request = new snoowrap(requestParameters);

const UPVOTE_THRESHOLD = 7;


jsonfile.readFile('../comments.json', function(err, obj) {

	// Check refreshed scores of comments in list.
	dance:
	for (var i=0; i < obj.comments.length; i++) {

		if (obj.comments[i].hasposted == 0 && obj.comments[i].score >= UPVOTE_THRESHOLD) {
			// Query winning comments siblings
			var siblingIndices = [i];
			for (var j=0; j < obj.comments.length; j++) {
				// find all matching parent threads
				if (i != j && obj.comments[i].thread == obj.comments[j].thread) {
					siblingIndices.push(j);
				}
			}
			// Find the highest sentence ending comment in that thread
			// Flag them all as having posted in this thread.
			var winningIndex = siblingIndices[0];
			for (var j=0; j < siblingIndices.length; j++) {
				if (obj.comments[siblingIndices[j]].score > obj.comments[winningIndex].score) {
					winningIndex = siblingIndices[j];
				}
				obj.comments[siblingIndices[j]].hasposted = 1;
			}
			jsonfile.writeFile('../comments.json', obj);
			
			// compile the sentence.
			var parentID = obj.comments[winningIndex].id;
			parentID = "t1_" + parentID;
			var wordString = "";
			addWord(parentID);
			function addWord(parentID) {
				request.getComment(parentID).refresh().then(function(parent) {
					parentID = parent.parent_id;
					wordString = parent.body + " " + wordString;
					if (parentID[1] == '1') {
						addWord(parentID);
					}
					else if (parentID[1] == '3') {
						// String process sentence for spaces and formatting
						for (var i=0; i < wordString.length - 1; i++) {
							if (wordString[i] === ' ' && wordString[i+1] === ' ') {
								wordString = wordString.slice(0, i) + wordString.slice(i + 1, wordString.length);
							}
						}
						for (var i=0; i < wordString.length; i++) {
							if (wordString[i] == '.' || wordString[i] == '?' || wordString[i] == '!' || wordString[i] == ',') {
								if (i > 0 && wordString[i-1] === ' ') {
									wordString = wordString.slice(0, i-1) + wordString.slice(i, wordString.length);
								}
							}
						}
						// post image to node canvas thingy in working directory.
						textToImage.generate(wordString, {debug: true, maxWidth: 600, fontSize: 36, lineHeight: 45, margin: 16, bgColor: "#3aa41e", textColor: "white"});
						find.file(/\.png$/, __dirname, function(files) {
							imgur.upload(files[files.length -1].slice(files[files.length -1].length - 23, files[files.length -1].length), function(err, res) {
								// make reddit request here.
								var spoilerPost = "[/r/onewordeach says:](" + res.data.link + ")";
								request.getSubmission(parentID).reply(spoilerPost);
							});
							fs.unlink(files[files.length -1].slice(files[files.length -1].length - 23, files[files.length -1].length));
						});
					}
				});
			}
			break dance; // can only post one winning sentence per execution
		}
	}

});

