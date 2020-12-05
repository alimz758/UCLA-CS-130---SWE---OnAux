const assert = require('chai').assert;
const expect = require('chai').expect;
const app = require('../src/app');
const user = require('../src/user/index');
const session = require('../src/session/index')
const request = require("supertest")("http://localhost:8000");
const {v4: uuidv4} = require("uuid");
let token = null;
let user_id = null;
let session_id = null;

describe("GET /session/create", function () {
    it("should say Hello", async function(){
	const response = await request.get("/session/create");
	console.log(response['text']);
	assert.equal(response['text'], "Hello");
    });
});
describe("POST /user/signup", function () {
  it("User sign up", async function () {
    const response = await request
      .post("/user/signup")
      .send({ username: `u8d82dd885${uuidv4()}s`, firstName : "u5s",
      lastName : "u666s",
      email: `usedd2r${uuidv4()}@gmail.com`,
      password : "12d34d" });
    console.log(response);
    token = response['body']['token'];
    user_id = response['body']['user']['_id'];
    console.log(token);
    expect(response.status).to.eql(201);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("POST /session/create", function () {
  it("User sign up", async function () {
    const response = await request
      .post("/session/create")
      .send({ sessionName: "session"})
      .set("Authorization", "Bearer " + token);
    session_id = response['body']['newSessionInfo']['_id'];
    console.log(response);

    expect(response.status).to.eql(201);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
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
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("First try: POST /session/session-id=sessionID/history/add-song", function () {
  it("User sign up", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/history/add-song`)
      .send({ songInfo: {
         "songuri" : "849846161",
         "songName" : "Sad Sad City",
         "artist" : "Ghostland Observatory",
         "album" : "Single"
      }
  }).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("First try: POST /session/session-id=sessionID/history/add-song", function () {
  it("User sign up", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/history/add-song`)
      .send({ songInfo:  {
        "songuri": "849846121",
        "songName": "Bad & Boujee",
        "artist": "Migos",
        "album": "Single"
    }
  }).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("First try: POST /session/session-id=sessionID/history/add-song", function () {
  it("User sign up", async function () {
    const response = await request
      .post(`/session/session-id=${session_id}/history/add-song`)
      .send({ songInfo:  {
        "songuri": "849846121",
        "songName": "Bad & Boujee",
        "artist": "Migos",
        "album": "Single"
    }
  }).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("GET /session/session-id=sessionID/history", function () {
  it("User sign up", async function () {
    const response = await request
      .get(`/session/session-id=${session_id}/history/`)
      .set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("POST /session/session-id=sessionID/history", function () {
  it("User sign up", async function () {
    const response = await request
      .get(`/session/session-id=${session_id}/request-song`)
      .send({ songInfo:  {
        "songuri": "849846121",
        "songName": "Bad & Boujee",
        "artist": "Migos",
        "album": "Single"
  	  	}
  	}).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});


describe("POST /user/add-song", function () {
  it("User sign up", async function () {
    const response = await request
      .post(`/user/add-song`)
      .send({   songInfo: {
         "songuri" : "0176789",
         "songName" : "One of these Nights",
         "artist" : "The Eagles",
         "album" : "Single"
      }
  	}).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("GET /user/likes", function () {
  it("User Likes page", async function () {
    const response = await request
      .get(`/user/likes`).set("Authorization", "Bearer " + token);
    console.log(response);

    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});

describe("POST /user/logout", function () {
  it("User Log Out", async function () {
    const response = await request
      .post(`/user/logout`).set("Authorization", "Bearer " + token);
    assert.equal(response['text'], "User Logged out!");
    console.log(response)
    expect(response.status).to.eql(200);

    //const attributes = response.body.data.attributes;
    //expect(attributes).to.include.keys("kilometers", "miles", "nautical_miles");
    //expect(attributes.kilometers).to.eql(8692.066508240026);
    //expect(attributes.miles).to.eql(5397.239853492001);
    //expect(attributes.nautical_miles).to.eql(4690.070954910584);
  });
});
describe("GET /session/create", function () {
    it("should say Hello", async function(){
	const response = await request.get("/session/create");
	console.log(response['text']);
	assert.equal(response['text'], "Hello");
    });
});





