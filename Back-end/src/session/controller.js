const Session = require("./session").Session;
const Song = require("../song/song").Song;

const createSession = async (userInfo, sessionBody) => {
    return new Promise (async (resolve, reject) => {
        try {
            const sessionInfo = {
                ownerName: userInfo.name,
                sessionName : sessionBody.sessionName,
                owner: userInfo._id, 
                requestedSongs: new Map()
            }
            const newSession = await Session.create(sessionInfo)
            userInfo.djSessionID = newSession._id
            await userInfo.save()
            resolve(newSession)
        }
        catch (e) {
            userInfo.djSessionID = undefined
            reject(e)
        }
    })
}

//returns a user's list of liked songs in JSON
const dumpHistory = (sessionInfo) => {
    return new Promise(async (resolve, reject) => {
        let hist = [];
        const songIds = sessionInfo.history;
        for (s of songIds) {
            const songMongoID = s['_id'];
            await Song.findById(songMongoID, (err, songObj) => {
                if (err || songObj === null) {}
                else {
                    const entry = {
                        songuri: songObj['songuri'],
                        songName: songObj['songName'],
                        artist: songObj['artist'],
                        album: songObj['album'],
                    };
                    hist.push(entry);
                }
            });
        }
        resolve(hist);
    })
}

//returns true when song already in users liked list
const duplicateHistorySong = (sessionInfo, songInfo) => {
    return new Promise(async (resolve, reject) => {
        const songuri = songInfo['songuri'];
        const songIds = sessionInfo.history;
        for (s of songIds) {
            const songMongoID = s['_id'];
            await Song.findById(songMongoID, 'songuri', (err, songObj) => {
                if (err || songObj === null) {}
                else {
                    if (songObj['songuri'] === songuri) {
                        resolve(true);
                    }
                }
            });
        }
        resolve(false);
    })
}


//not the best solution
const createSongInfoWithVote = async (session, songInfo, vote) => {
    return new Promise (async (resolve, reject) => {
        try {
            const newSongInfo = {
                songuri: songInfo.songuri,
                songName : songInfo.songName,
                artist: songInfo.artist, 
                album: songInfo.album,
                vote: vote
            }
            session.requestedSongObj = session.requestedSongObj.filter((requestedSongObj)=>{
                return requestedSongObj.songuri !== songInfo.songuri
            })
            session.requestedSongObj.push(newSongInfo)
            await session.save()
            resolve(session)
        }
        catch (e) {
            console.log(e)

            reject(e)
        }
    })
}


module.exports = {
    createSession,
    dumpHistory,
    duplicateHistorySong,
    createSongInfoWithVote
}