const jwt = require("jsonwebtoken");
const User = require("../user/user").User
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//Middleware for auth
const jwtAuth = async (req, res, next) => {

  try {

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ email: decoded.email, 'tokens.token':token})

    if (!user) { 
      throw new Error
    }

    req.token = token
    req.user = user;
    next();
  } 
  catch (error) {

    return res.status(401).json({
      message: "ERROR: Please authenticate"
    });
  }
};

module.exports = jwtAuth;