const checkAuth = require("../middleware/jwt_authenticator.js");
const Session = require("./session").Session;
const express = require("express");
const router = new express.Router();
const db = require("./controller.js");


//================= Create a DJ Session ==============
router.post("/session/create", checkAuth, async(req,res) => {

    try{
    
        const newSessionInfo = await db.createSession(req.user, req.body)
        const userAsDJWithSessionID = req.user
        res.status(201).send({userAsDJWithSessionID, newSessionInfo}) 
    }
    
    catch(e){
        res.status(500).send({error:e})
    }
})

//================= Get a Session Info With its ID as a parameter ==============
router.get("/session/session-id=:id", checkAuth, async(req,res) => {

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

//================= Get All Created SessionIDs ==============
router.get("/session/all", checkAuth, async(req,res) => {

    try{
        const allSessionIDs = await Session.find( { }, { sessionName: 1 } )
        if(!allSessionIDs){
            return res.status(404).send()
        }
        res.send(allSessionIDs)
    }
    catch(e){
        console.log(e)
        res.status(500).send({error:e})
    }
})

module.exports = router;