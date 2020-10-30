const Song = require("./song").Song;

const createSong = async (songBody) => {
    return new Promise (async (resolve, reject) => {
        try {
            const songInfo = {
                songuri : songBody.songuri,
                songName : songBody.songName,
                artist : songBody.artist,
                album : songBody.album
            }
            const newSong = await Song.create(songInfo)
            resolve(newSong)
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSong
}