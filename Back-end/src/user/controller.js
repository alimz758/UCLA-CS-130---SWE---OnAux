const User = require("./user").User;
const sha256 = require("sha256");
const multer = require("multer");
const Song = require("../song/song").Song;

/*
    Set the user Info
    Then set the DB
*/
const signup = async (userInfo) => {
    return new Promise (async (resolve, reject) => {
        userInfo.password = sha256(userInfo.password)
        userInfo.email= userInfo.email.toLowerCase()
        try {
            const newUser = await User.create(userInfo)
            resolve(newUser)
        }
        catch (e) {
            User.deleteOne({ email: userInfo.email }, () => {
                reject(e);
            });
        }
    })
}

//Validating the user info before signup, update
const isValidAccount = (email, password) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({email:email.toLowerCase().trim()})
        if (user) {
            return reject("An account already exists with this email!");
        }
        else {
            return resolve(true);
        }
    })
}

//Login helper
const login = (username, password, callback) => {
    User.findOne({
            username: username,
            password: password
        },
        (err, result) => {
            if (err) {
              callback(err, null);
            } 
            else if (result === null) {
              callback({ error: "User with email and password not found" }, null);
            } 
            else {
              callback(null, result);
            }
        }
    )
}

//middleware for uploading files
const profilePicUpload = multer({
    limits:{
        //2Mb Max Size is allowed
        fileSize: 2000000
    },
    //filter the extensions that are allowed
    fileFilter(req, file, callback){
        //accept jpg,png, jpeg
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("File must be an image with '.jpg', '.png' or '.jpeg' extension"))
        }
        callback(undefined,true) 
    }
})

//returns true when song already in users liked list
const duplicateSong = (userInfo, songInfo) => {
    return new Promise(async (resolve, reject) => {
        const songuri = songInfo['songuri'];
        const songList = userInfo.likedSongs;
        for (s of songList) {
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


module.exports ={
    signup,
    isValidAccount,
    login,
    profilePicUpload,
    duplicateSong
}