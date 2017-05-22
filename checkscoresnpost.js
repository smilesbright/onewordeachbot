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

const UPVOTE_THRESHOLD = 7;


jsonfile.readFile('./Desktop/onewordeachbot/comments.json', function(err, obj) {

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
			jsonfile.writeFile('./Desktop/onewordeachbot/comments.json', obj);
			
			// compile the sentence. set comments to hasposted = 1

			var parentID = obj.comments[winningIndex].id;
			//console.log(parentID);
			parentID = "t1_" + parentID;
			var wordString = new String();
			addWord(parentID);
			function addWord(parentID) { // (parentID[1] == '1' && newWord == 1) {
				request.getComment(parentID).refresh().then(function(parent) {
					parentID = parent.parent_id;
					wordString = parent.body + " " + wordString;
					//console.log(wordString);
					if (parentID[1] == '1') {
						addWord(parentID);
					}
					else if (parentID[1] == '3') {
						// String process sentence for spaces and formatting
						for (var i=0; i < wordString.length - 1; i++) {
							if (wordString[i] === ' ' && wordString[i+1] === ' ') {
								wordString = wordString.slice(0, i) + wordString.slice(i + 1, wordString.length);
								//wordString.replace("  ", " ");
							}
						}
						for (var i=0; i < wordString.length; i++) {
							if (wordString[i] == '.' || wordString[i] == '?' || wordString[i] == '!' || wordString[i] == ',') {
								if (i > 0 && wordString[i-1] === ' ') {
									wordString = wordString.slice(0, i-1) + wordString.slice(i, wordString.length);
								}
							}
						}
						// console.log(parentID);
						// Post sentence and sticky
						var spoilerPost = "[/r/onewordeach says:](/" + wordString + ")";
						request.getSubmission(parentID).reply(spoilerPost);
						//console.log(wordString);
						// sticky post with a separate script.
						// request.getUser('onewordeachbot').getComments().then(console.log);
					}
				});
			}
			break dance;
		}
	}

});








