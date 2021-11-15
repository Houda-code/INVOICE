const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const token = req.header("access_token");
  if (!token) {
    return res.status(401).json({ err_message: "No token provided" });
  }
  try {
    const verifiedUser = jwt.verify(token, process.env.TOKEN_KEY);
    req.verifiedUser = verifiedUser;
    next();
  } catch (err) {
    return res.status(500).json({ err_message: err });
  }
};