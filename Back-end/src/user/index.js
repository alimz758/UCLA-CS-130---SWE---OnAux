const express = require("express");
const router = new express.Router();
const sha256 = require("sha256");
const UserDB = require("./controller.js");
const SongDB = require("../song/controller.js");
const sharp = require("sharp");
const checkAuth = require("../middleware/jwt_authenticator.js");
const User = require("./user.js").User;


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
            const likes = await UserDB.dumpUserLikes(user);
            let clone = JSON.parse(JSON.stringify(user));
            clone.likedSongs = likes;
            res.send({clone, token})
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
        if(!user){
            return res.status(404).send()
        }
        const likes = await UserDB.dumpUserLikes(user);
        let clone = JSON.parse(JSON.stringify(user));
        clone.likedSongs = likes;
        res.send({userInfo:clone})
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
        return res.send(user.profilePic)
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
        return res.send()
    }
    catch(e){
        return res.status(500).send({error:e})
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
        const likesJSON = await UserDB.dumpUserLikes(req.user);
        return res.send(likesJSON);
    }
    catch(e){
        return res.status(500).send({error:e});
    }
})

//================= Get all Songs in Liked List ==============
router.get("/user/likes", checkAuth, async(req,res) => {
    try{
        const userInfo = req.user;
        if(!userInfo){
            return res.status(404).send("Bad User!");
        }
        const likesJSON = await UserDB.dumpUserLikes(req.user);
        return res.send(likesJSON);
    }
    catch(e){
        return res.status(500).send({error:e});
    }
})

//================= Get all Songs in Liked List ==============
router.delete("/user/remove-song", checkAuth, async(req,res) => {
    try{
        const userInfo = req.user;
        const songInfo = req.body.songInfo;

        if(!userInfo){
            return res.status(404).send("Bad User!");
        } else if (!songInfo.songuri || songInfo.songuri === "") {
            return res.status(400).send("Incomplete song uri");
        }

        const oldLen = userInfo.likedSongs.length;
        userInfo.likedSongs = await Promise.all(userInfo.likedSongs.map(async function (s) {
            const songMongoID = s['_id'];
            return (await UserDB.sameSong(songMongoID,songInfo.songuri)) ? null : s;
        }));
        
        userInfo.likedSongs = userInfo.likedSongs.filter(item => {
            return (item === null) ? false : true;
        });
        const newLen = userInfo.likedSongs.length;

        if (newLen === oldLen) {
            return res.send(`could not find song with uri ${songInfo.songuri} in user likes`);
        }
        await req.user.save();
        const likesJSON = await UserDB.dumpUserLikes(req.user);
        return res.send(likesJSON);
    }
    catch(e){
        return res.status(500).send({error:e});
    }
})

module.exports = router;