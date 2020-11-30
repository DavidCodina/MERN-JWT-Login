const jwt = require("jsonwebtoken");


/* =============================================================================

============================================================================= */


exports.checkAuth = (req, res, next) => {
  const token = req.get("x-auth-token");


  if (token === 'null' || !token){
    return res.status(401).json({error: "No access token, authorization denied." });
  }


  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload.user;
    next();
  }

  catch (err){
    if (err.name === "TokenExpiredError"){
      //I made up this name : AccessTokenExpiredError
      return res.status(401).json({ error: "AccessTokenExpiredError" });
    }

    else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "JsonWebTokenError" });
    }

    else {
      //catch other unprecedented errors
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  } //End of catch
};
