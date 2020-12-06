const assert = require('chai').assert;
const expect = require('chai').expect;
const request = require("supertest")("http://localhost:8000");
const {v4: uuidv4} = require("uuid");
let token = null;
let user_id = null;
let session_id = null;
let _username = `${uuidv4()}`;
let _firstName = "u5s";
let _lastName = "u666s";
let _email = `${uuidv4()}`;
let _password = `12d34d`;
let _sessionName = 'Jakes Session';

describe("GET /session/create", function () {
    it("Should say Hello", async function(){
	const response = await request.get("/session/create");
	console.log(response['text']);
	assert.equal(response['text'], "Hello");
    });
});

describe("POST /user/signup", function () {
  it("User sign up", async function () {
    const response = await request
      .post("/user/signup")
      .send({ username: _username, firstName : _firstName,
      lastName : _lastName,
      email: _email,
      password : _password});
    console.log(response['text']);
    token = response['body']['token'];
    user_id = response['body']['user']['_id'];

    console.log(JSON.parse(response['text'])['user']['createdAt']);
    expect(response.status).to.eql(201); // make sure correct status, then check for correct information
    expect(JSON.parse(response['text'])['user']['username']).to.eql(_username);
    expect(JSON.parse(response['text'])['user']['firstName']).to.eql(_firstName);
    expect(JSON.parse(response['text'])['user']['lastName']).to.eql(_lastName);
    expect(JSON.parse(response['text'])['user']['email']).to.eql(_email);
    //Important - must make sure that a valid token has been returned to the user
    assert(token.length > 0);
  });
});

describe("POST /session/create", function () {
  it("Create Session", async function () {
    const response = await request
      .post("/session/create")
      .send({ sessionName: _sessionName})
      .set("Authorization", "Bearer " + token);
    session_id = response['body']['newSessionInfo']['_id'];
    console.log(response['text']);
    expect(JSON.parse(response['text'])['newSessionInfo']['sessionName']).to.eql(_sessionName);

    expect(response.status).to.eql(201);
  });
});

describe("POST /session/session-id=sessionID/set-current-song", function () {
  it("Sets the current song to be played", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/set-current-song`)
      .send({ songInfo: {
         "songuri" : "849846161",
         "songName" : "Sad Sad City",
         "artist" : "Ghostland Observatory",
         "album" : "Single"
      }
  }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    expect(JSON.parse(response['text'])['currentSongInfo']['songuri']).to.eql( "849846161");
    expect(JSON.parse(response['text'])['currentSongInfo']['songName']).to.eql( "Sad Sad City");
    expect(JSON.parse(response['text'])['currentSongInfo']['artist']).to.eql( "Ghostland Observatory");
    expect(JSON.parse(response['text'])['currentSongInfo']['album']).to.eql( "Single");
    expect(JSON.parse(response['text'])['sessionName']).to.eql(_sessionName);
    expect(response.status).to.eql(200);
  });
});
describe("POST /user/add-song", function () {
  it("Add another song to User's Liked Songs", async function () {
    const response = await request
      .post(`/user/add-song`)
      .send({   songInfo: {
         "songuri" : "84938463",
         "songName" : "Bad & Boujee",
         "artist" : "Migos",
         "album" : "Single"
      }
  	}).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    console.log(response['text']['createdAt']);
    expect(response.status).to.eql(200);
    expect(JSON.parse(response['text'])[0]['songuri']).to.eql("84938463");
    expect(JSON.parse(response['text'])[0]['songName']).to.eql( "Bad & Boujee");
    expect(JSON.parse(response['text'])[0]['artist']).to.eql("Migos");
    expect(JSON.parse(response['text'])[0]['album']).to.eql("Single");
  });
});
describe("First try: POST /session/session-id=sessionID/history/add-song", function () {
  it("Adds a song to session's history", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/history/add-song`)
      .send({ songInfo: {
         "songuri" : "849846161",
         "songName" : "Sad Sad City",
         "artist" : "Ghostland Observatory",
         "album" : "Single"
      }
  }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    expect(JSON.parse(response['text'])[0]['songuri']).to.eql( "849846161");
    expect(JSON.parse(response['text'])[0]['songName']).to.eql( "Sad Sad City");
    expect(JSON.parse(response['text'])[0]['artist']).to.eql( "Ghostland Observatory");
    expect(JSON.parse(response['text'])[0]['album']).to.eql( "Single");
    expect(response.status).to.eql(200);
  });
});



describe("Vote 1: POST /session/session-id=sessionID/request-song", function () {
  it("Request a song to be in the Session", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/request-song`)
      .send(   {
      "songInfo": {
         "songuri" : "84938463",
         "songName" : "Bad & Boujee",
         "artist" : "Migos",
         "album" : "Single"
      },
      "vote" : "1"
   }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    expect(response.status).to.eql(200);
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['vote'] == 1)
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songuri'] == "84938463")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songName'] == "Bad & Boujee")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['artist'] == "Migos")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['album'] ==  "Single")
  });
});

describe("Vote 2: POST/session/session-id=sessionID/request-song", function () {
  it("Request a song to be in the Session", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/request-song`)
      .send(   {
      "songInfo": {
         "songuri" : "84938463",
         "songName" : "Bad & Boujee",
         "artist" : "Migos",
         "album" : "Single"
      },
      "vote" : "1"
   }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['vote'] == 2)
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songuri'] == "84938463")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songName'] == "Bad & Boujee")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['artist'] == "Migos")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['album'] ==  "Single")
    expect(response.status).to.eql(200);
  });
});

describe("Vote 3: POST /session/session-id=sessionID/request-song", function () {
  it("Request a song to be in the Session", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/request-song`)
      .send(   {
      "songInfo": {
         "songuri" : "84938463",
         "songName" : "Bad & Boujee",
         "artist" : "Migos",
         "album" : "Single"
      },
      "vote" : "1"
   }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    console.log(JSON.parse(response['text'])['createdAt']);
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['vote'] == 3)
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songuri'] == "84938463")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songName'] == "Bad & Boujee")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['artist'] == "Migos")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['album'] ==  "Single")
    expect(response.status).to.eql(200);
  });
});

describe("Vote 4 (downvote): POST /session/session-id=sessionID/request-song", function () {
  it("Request a song to be in the Session", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/request-song`)
      .send(   {
      "songInfo": {
         "songuri" : "84938463",
         "songName" : "Bad & Boujee",
         "artist" : "Migos",
         "album" : "Single"
      },
      "vote" : "-1"
   }).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    console.log(JSON.parse(response['text'])['createdAt']);
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['vote'] == 2)
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songuri'] == "84938463")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['songName'] == "Bad & Boujee")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['artist'] == "Migos")
    assert(JSON.parse(response['text'])["requestedSongObj"][0]['album'] ==  "Single")
    expect(response.status).to.eql(200);
  });
});

describe("GET /session/session-id=sessionID/history", function () {
  it("View the session's history", async function () {
    const response = await request
      .get(`/session/session-id=${session_id}/history/`)
      .set("Authorization", "Bearer " + token);
    console.log(response['text']);
    assert(JSON.parse(response['text']).length >= 1);
    expect(response.status).to.eql(200);
  });
});

describe("GET /user/likes", function () {
  it("View the User's Liked Songs", async function () {
    const response = await request
      .get(`/user/likes`).set("Authorization", "Bearer " + token);
    console.log(response['text']);
    expect(response.status).to.eql(200);
    expect(JSON.parse(response['text'])[0]['songuri']).to.eql("84938463");
    expect(JSON.parse(response['text'])[0]['songName']).to.eql( "Bad & Boujee");
    expect(JSON.parse(response['text'])[0]['artist']).to.eql("Migos");
    expect(JSON.parse(response['text'])[0]['album']).to.eql("Single");
  });
});
describe("POST /user/logout", function () {
  it("User Log Out", async function () {
    const response = await request
      .post(`/user/logout`).set("Authorization", "Bearer " + token);
    assert.equal(response['text'], "User Logged out!");
    console.log(response['text'])
    expect(response.status).to.eql(200);
  });
});
describe("GET /session/create", function () {
    it("should say Hello. No longer logged in", async function(){
	const response = await request.get("/session/create");
	console.log(response['text']);
	assert.equal(response['text'], "Hello");
    });
});





