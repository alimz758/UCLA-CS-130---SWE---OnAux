const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Session = require("../session/session").Session;

const userSchema = mongoose.Schema({

    email:      { type: String, required: true, unique: true },
    username:   { type: String, index: true },
    password:   { type: String, required:true },
    profilePic: { type: Buffer},
    createdAt:  { type: Date, default: new Date()},
    djSessionID : { type: String},
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    likedSongs:[{
        song:{
            type: String,
            ref: 'Song'
        }
    }],
})

//relation with Session
userSchema.virtual('session',{
    ref: 'Session',
    localField:'_id', 
    foreignField:'owner' 
})

//user method to generate a token
userSchema.methods.generateAuthToken = async function (){

    const user = this
    const token = jwt.sign({email:user.email}, process.env.JWT_SECRET_KEY, {expiresIn: "24hr"})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

//helper methods to remove the private data: password and tokens array from the return object
//call to res.send() would call this method
userSchema.methods.toJSON = function(){

    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User = mongoose.model("User", userSchema);
module.exports = {User};