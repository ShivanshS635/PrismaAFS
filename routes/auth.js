const express = require("express");
const router = express.Router();
const jwt= require("jsonwebtoken");
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/login" , async(req , res) => {
    const {email , password} = req.body;
    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    });
    if(!user){
        return res.status(404).json({message : "User Not Found"});
    }else{
        if(user.password === password){
            let secret = "JWT_SECRET_KEY";
            let token = jwt.sign(user , secret);
            res.json({message : "Login Successfull" , token:token});
        }else{
            return res.json({message : "Login Failed"});
        }
    }
})

module.exports = router;