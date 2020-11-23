const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    songuri:     {type: String}, // if Spotify sends back unique IDs
    songName:    {type: String},
    artist:      {type: String},
    album:       {type: String},
})
const Song = mongoose.model("Song", songSchema);

module.exports = {Song};