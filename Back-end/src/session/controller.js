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

module.exports = {
    createSession
}