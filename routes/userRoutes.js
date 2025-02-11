const express = require("express");
const router = express.Router();
const {PrismaClient} = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
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

router.post('/', isLoggedIn ,async (req, res) => {
    const {email, name , password} = req.body;
    let newUser = await prisma.user.create({
        data : {
            email : email,
            name : name,
            password : password
        }
    });
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