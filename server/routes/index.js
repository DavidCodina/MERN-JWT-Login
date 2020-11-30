const router         = require("express").Router();
const AuthController = require("../controllers/AuthController");
const User           = require("../models/user.model"); //imported for /user route
const Middleware     = require("../middlewares");


/* =============================================================================

============================================================================= */


router.post("/auth/register", AuthController.register);


router.post("/auth/login", AuthController.login);


router.post("/auth/refresh_access_token", AuthController.refreshAccessToken);


router.delete("/auth/logout", AuthController.logout);


router.post("/auth/token_is_valid", AuthController.validateToken);


/* =============================================================================

============================================================================= */


router.get("/user", Middleware.checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    res.status(200).json({
      msg: "User data obtained.",
      user: { id: user._id, displayName: user.displayName }
    });
  }

  catch (err){
    console.log("\nThere might be a bug in the /user code: \n", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
