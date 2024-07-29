const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    // check if token is present in the middleware
    return res.status(401).send("Acess Denied");
  }
  try {
    //if it is present, verify the token
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    // if token is invalid, return 400
    return res.status(400).send("Invalid Token");
  }
};

module.exports = authMiddleware;
