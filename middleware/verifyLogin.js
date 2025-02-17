let jwt = require("jsonwebtoken");
function isLoggedIn(req, res, next) {
    try{
        console.log(req.headers.authorization)
   let token = req.headers.authorization;
   console.log(token)
   let secret = "JWT_SECRET_KEY"
    if (!token) {
        return res.status(401).json({ message: "Please Login First" });
    }

        let user =   jwt.verify(token, secret);
        
        console.log(user);
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = isLoggedIn;