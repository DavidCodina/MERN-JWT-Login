const mongoose = require("mongoose");
const jwt      = require("jsonwebtoken");
//const bcrypt   = require("bcryptjs"); //Only necessary if using pre() to hash password.
const Token    = require("./token.model");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;




const userSchema = new mongoose.Schema({
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true, minlength: 5 },
  displayName: { type: String },
});


/* =============================================================================

============================================================================= */


userSchema.methods = {

  createAccessToken: async function(){
    try {
      //This assumes an _id and email property exists on the userSchema (_id is set by default).
      let { _id, email } = this;
      //Should match expiration of login accessToken as defined in AuthController.js's refreshAccessToken()
      let accessToken = jwt.sign({ user: { _id: _id, email: email } }, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
      return accessToken;
    }
    catch (err){ return console.error(err); }
  },


  createRefreshToken: async function(){
    try {
      let { _id, email } = this; //This assumes an _id and email property exists on the userSchema (_id is set by default).
      let refreshToken   = jwt.sign({ user: { _id: _id, email: email } }, REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
      await new Token({ token: refreshToken }).save();
      return refreshToken;
    }
    catch (err){ return console.error(err); }
  }

};


module.exports = mongoose.model("User", userSchema);
