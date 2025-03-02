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
    console.log(user)
    if(!user){
        return res.status(404).json({message : "User Not Found"});
    }else{
        if(user.password === password){
            let secret = "JWT_SECRET_KEY";
            let token = jwt.sign(user , secret);
            
            res.json({message : "Login Successfull" , token:token , user});
        }else{
            return res.json({message : "Login Failed"});
        }
    }
})

router.post("/register", async (req, res) => {
    const { email, name, password, isAdmin } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password,
                isAdmin: isAdmin || false,
            },
        });

        let secret = "JWT_SECRET_KEY";
        let token = jwt.sign({id: newUser.id, email: newUser.email, isAdmin: newUser.isAdmin} , secret);

        res.json({ message: "Registration Successful", token: token, user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Registration Failed" });
    }
});

module.exports = router;