const User   = require("../models/user.model");
const Token  = require("../models/token.model");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;


/* =============================================================================

============================================================================= */


exports.register = async (req, res) => {
  try {
    let { email, password, passwordCheck, displayName } = req.body;


    /* ==========================
            Validation
    ========================== */


    if (!email || !password || !passwordCheck){
      return res.status(400).json({ error: "Please complete required fields." });
    }

    //Need some kind of validation for email.


    if (password.length < 5){
      return res.status(400).json({ error: "The password needs to be at least 5 characters long." });
    }


    if (password !== passwordCheck){
      return res.status(400).json({ error: "Enter the same password twice for verification." });
    }


    const existingUser = await User.findOne({ email: email });
    if (existingUser){
      return res.status(400).json({ error: "An account with this email already exists." });
    }


    /* ==========================

    ========================== */


    if (!displayName){ displayName = email; }


    /* ==========================
          Password Hashing
    ========================== */


    const salt           = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);


    /* ==========================
          Create New User
    ========================== */


    let newUser = new User({ email: email, password: hashedPassword, displayName: displayName });
    newUser     = await newUser.save();

    return res.status(201).json({ msg: "Registration successful. Please login now. (Server)" });
  } //End of try


  catch (err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error! (Server)" });
  }
};


/* =============================================================================

============================================================================= */


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;


    /* ==========================
            Validation
    ========================== */



    if (!email || !password){
      return res.status(400).json({ error: "Not all fields have been entered." });
    }


    const user = await User.findOne({ email: email });


    if (!user){
      return res.status(400).json({ error: "No account with this email has been registered." });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(400).json({ error: "Invalid password." });
    }


    /* ==========================
      Create tokens, and send back success data
    ========================== */


    let accessToken  = await user.createAccessToken();
    let refreshToken = await user.createRefreshToken();


    return res.status(201).json({
      msg:          "Login successful. (Server)",
      accessToken:  accessToken,
      refreshToken: refreshToken,
      user: { id: user._id, displayName: user.displayName }
    });
  } //End of try block


  catch (err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error! (Server)" });
  }
};


/* =============================================================================

============================================================================= */


exports.refreshAccessToken = async (req, res) => {
  try {
    let { refreshToken } = req.body;

    if (refreshToken === 'null' || !refreshToken){
      return res.status(403).json({ error: "Access denied, token missing!" });
    }


    else {
      const tokenDoc = await Token.findOne({ token: refreshToken });

      if (!tokenDoc){
        return res.status(401).json({
          error: "No matching refreshToken in database. This means it's been removed, or the sent refresh token is bogus."
        });
      }


      else {
        const payload     = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign(
          { user: payload.user },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "10m" } //Should match expiration of login accessToken as defined in userModel.js's createAccessToken()
        );

        return res.status(200).json({ accessToken: accessToken });
      }

    }
  }

  catch (err){
    console.error(err);

    if (err.name === "TokenExpiredError"){
      //I made up this name : RefreshTokenExpiredError
      return res.status(401).json({ error: "RefreshTokenExpiredError" });
    }

    else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "JsonWebTokenError" });
    }

    else {
      //catch other unprecedented errors
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
};


/* =============================================================================

============================================================================= */


exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const deletedTokenDoc  = await Token.findOneAndDelete({ token: refreshToken });
    return res.status(200).json({ msg: "You are now logged out! (Server)" });
  }

  catch (err){
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error! (Server)" });
  }
};


/* =============================================================================

============================================================================= */


exports.validateToken = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token){ return res.json(false); }

    const decoded = await jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
     if (err){
       console.log("\n\nError within validateToken()'s jwt.verify() -likely due to accessToken being invalid.");
       console.log(err);
       return false; //i.e., to verified
     } else {
       return decoded; //i.e., to verified
     }
    });


    if (!decoded){ return res.json(false); }


    const user = await User.findById(decoded.user._id);

    
    if (!user){
      return res.json(false);
    }


    return res.json(true);

  } catch (err){
    //console.log("\nThere might be a bug in the /tokenIsValid code: \n", err);
    res.status(500).json({ error: err.message });
  }
}
