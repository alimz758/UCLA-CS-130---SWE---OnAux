const User = require("./user").User;
const mongoose = require("mongoose");
const sha256 = require("sha256");

/*
    Set the user Info
    Then set the DB
*/
const signup = async (userInfo) =>{

    return new Promise (async (resolve, reject) =>{

        userInfo.password = sha256(userInfo.password)
        userInfo.email= userInfo.email.toLowerCase()
        userInfo.username = userInfo.username

        try{

            const newUser = await User.create(userInfo)
            resolve(newUser)
        }

        catch (e){
            console.log(e)
            User.deleteOne({ email: userInfo.email }, () => {
                reject(e);
            });
        }
    })
}

//Validating the user info before signup, update
const isValidAccount = (email, password) => {

    return new Promise(async (resolve, reject)=>{

        const user = await User.findOne({email:email.toLowerCase().trim()})

        if(user){

            return reject("An account already exists with this email!");
        }
        else{
            return resolve(true);
        }
    })
}

//Login helper
const login = (email, password, callback) => {

    User.findOne({

            email: email.toLowerCase(),
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

module.exports ={
    signup,
    isValidAccount,
    login
}