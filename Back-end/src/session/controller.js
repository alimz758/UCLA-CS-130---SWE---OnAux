const Session = require("./session").Session;

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

module.exports = {
    createSession,
    dumpHistory
}