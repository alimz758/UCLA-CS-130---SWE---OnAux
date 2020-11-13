const express = require("express");
const router = new express.Router();
const sha256 = require("sha256");
const UserDB = require("./controller.js");
const SongDB = require("../song/controller.js");
const sharp = require("sharp");
const checkAuth = require("../middleware/jwt_authenticator.js");
const { checkSongDuplicate } = require("./controller.js");
const User = require("./user.js").User;
const Song = require("../song/song").Song;


//================= SIGN UP ==============
router.post("/user/signup", async(req,res)=>{
    try{
        if( await UserDB.isValidAccount(req.body.email, req.body.password, req.body.username)){
            const user = await UserDB.signup(req.body)
            const token = await user.generateAuthToken()
            res.status(201).send({user, token}) 
        } 
    }
    catch(e){
        console.log(e)
        res.status(409).send({ error: e });
    }
})

//================= LOG IN ==============
router.post("/user/login", async(req, res) => {
    if(req.body.password){
        req.body.password = sha256(req.body.password)
    }
    UserDB.login(req.body.username, req.body.password, async (error,user)=>{
        if(error){
            res.status(401).send(error)
        }
        else{
            const token =  await user.generateAuthToken()
            res.send({user, token})
        }
     })
});

//================= LOGOUT ==============
router.post("/user/logout", checkAuth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send("User Logged out!")
    }
    catch(e){
        res.status(500).send({error:e})
    }
});

//================= Get User by ID ==============
router.get("/user/user-id=:id", checkAuth, async(req,res)=>{
    try{
        const user = await User.findById({_id:req.params.id})
        console.log(user)
        if(!user){
            return res.status(404).send()
        }
        res.send({userInfo:user})
    }
    catch(e){
        res.status(500).send({error:e})
    }
})

//================= Upload Profile Picture ==============
router.post("/user/profile-pic", checkAuth, UserDB.profilePicUpload.single('profile-pic'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.profilePic = buffer
    await req.user.save()
    res.send()
    }, 
    (error,req,res,next)=>{
        res.status(400).send({error: error.message})
})

//================= Get Profile Picture ==============
router.get("/user/profile-pic", checkAuth, async(req,res)=>{
    try{
        const user = req.user
        if(!user.profilePic){
            throw new Error("There is no profile picture")
        }
        res.set('Content-Type','image/png')
        res.send(user.profilePic)
    }
    catch (e){
        res.status(404).send({error:e})
    }
})

//================= Delete Profile Picture ==============
router.delete("/user/profile-pic", checkAuth, async(req,res)=>{
    try{
        req.user.profilePic = undefined
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send({error:e})
    }
})

//================= Add Song to Liked List ==============
router.post("/user/add-song", checkAuth, async(req,res) => {
    try{
        const userInfo = req.user;
        const songInfo = req.body.songInfo;
        if(!userInfo){
            return res.status(404).send("No User!");
        } else if (songInfo.songuri === "" || songInfo.songName === "" || songInfo.artist == "") {
            return res.status(400).send("Incomplete song information");
        }
        const duplicate = await UserDB.duplicateSong(userInfo, songInfo);
        if (!duplicate) {
            const newSong = await SongDB.createSong(songInfo);
            userInfo.likedSongs.push(newSong);
            await req.user.save();
        }
        res.send(req.user.likedSongs);
    }
    catch(e){
        res.status(500).send({error:e});
    }
})

//================= Get all Songs in Liked List ==============
router.get("/user/likes", checkAuth, async(req,res) => {
    try{
        const userInfo = req.user;
        if(!userInfo){
            return res.status(404).send("Bad User!");
        } 
        let likesInfo = [];
        const songIds = userInfo.likedSongs;
        for (s of songIds) {
            const songMongoID = s['_id'];
            Song.findById(songMongoID, (err, songObj) => {
                if (err || songObj === null) {}
                else {
                    const entry = {
                        songuri: songObj['songuri'],
                        songName: songObj['songName'],
                        artist: songObj['artist'],
                        album: songObj['album'],
                    };
                    likesInfo.push(entry);
                }
            });
        }
        res.send(likesInfo);
    }
    catch(e){
        res.status(500).send({error:e});
    }
})

module.exports = router;