const assert = require('chai').assert;
const app = require('../src/app');
const user = require('../src/user/index');
const session = require('../src/session/index')
const request = require("supertest")("http://13.59.212.151:8000");
describe('App', function(){
    it('app should return hello', function(){
	assert.equal(app(), 'hello');
    });
});

describe("GET /session/create", function () {
    it("should say Hello", async function(){
	const response = await request.get("/session/create");
	console.log(response['text']);
	assert.equal(response['text'], "Hello");
    });
});
