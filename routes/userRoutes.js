const express = require("express");
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const {sendMail} = require('../utils/sendMail');
const prisma = new PrismaClient();

router.get('/:email', async (req, res) => {
    const {email} = req.params;

    const user = await prisma.user.findUnique({
        where:{
            email : email
        }
    })
    res.json({user});
});

router.post('/' ,async (req, res) => {
    const {email, name , password} = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return res.status(400).json({ error: "Email already exists" });
    }
    
    let newUser = await prisma.user.create({
        data : {
            email : email,
            name : name,
            password : password,
            isAdmin: false
        }
    });

    let token = Math.floor(Math.random() * 1000000);
    
    const newToken = await prisma.token.create({
        data : {
            token : token.toString(),
            userId : newUser.id
        }
    });

    console.log(newToken.token);
    console.log(newToken.userId)

    let link = `http://localhost:4545/verify/${newToken.token}/${newToken.userId}`;
    
    sendMail(email , "Verify Email" , link);

    res.json({newUser});
});

router.delete('/:email', async (req, res) => {
    const {email} = req.params;
    const user = await prisma.user.delete({
        where:{
            email : email
        }
    });
    res.send("User Deleted");
});
module.exports = router;