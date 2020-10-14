const express = require("express");
const router = new express.Router();
const sha256 = require("sha256");
const db = require("./controller.js");
const User = require("./user").User
//middleware for auth
const checkAuth = require("../middleware/jwt_authenticator.js");


//================= SIGN UP ==============
router.post("/user/signup", async(req,res)=>{

    try{
        if( await db.isValidAccount(req.body.email, req.body.password, req.body.username)){

            const user = await db.signup(req.body)
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

    db.login(req.body.email, req.body.password, async (error,user)=>{

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

module.exports = router;