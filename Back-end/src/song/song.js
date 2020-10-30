const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    songuri:     {type: String}, // if Spotify sends back unique IDs
    songName:    {type: String},
    artist:      {type: String},
    album:       {type: String},
    upVotes:     {type:Number, default:0},
    downVotes:   {type:Number, default:0},
})
const Song = mongoose.model("Song", songSchema);

module.exports = {Song};