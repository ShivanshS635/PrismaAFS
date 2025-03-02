let jwt = require("jsonwebtoken");
function isLoggedIn(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    console.log(token)
    let secret = "JWT_SECRET_KEY";
    if (!token) {
      return res.status(401).json({ message: "Please Login First" });
    }

    let user = jwt.verify(token, secret);

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = isLoggedIn;
