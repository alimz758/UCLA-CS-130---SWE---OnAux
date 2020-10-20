const checkAuth = require("../middleware/jwt_authenticator.js");
const Session = require("./session").Session;
const express = require("express");
const router = new express.Router();
const db = require("./controller.js");


//================= Create a DJ Session ==============
router.post("/session/create", checkAuth, async(req,res) => {

    try{
    
        const newSession = await db.createSession(req.user, req.body)
        const userWithSessionID = req.user
        res.status(201).send({userWithSessionID, newSession}) 
    }
    
    catch(e){
        res.status(500).send({error:e})
    }
})

//================= Get a Session Info ==============
router.get("/session/:id", checkAuth, async(req,res) => {

    try{
        const sessionInfo = await Session.findById({ _id: req.params.id})
        if(!sessionInfo){
            return res.status(404).send()
        }
        res.send(sessionInfo)
    }
    catch(e){
        res.status(500).send({error:e})
    }
})

module.exports = router;