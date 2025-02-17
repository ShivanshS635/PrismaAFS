const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
const prisma = new PrismaClient();

router.post("/:blogid" , isLoggedIn , async (req , res) => {

    const {blogid} = req.params;
    const like = await prisma.like.create({
        data : {
            blogId : parseInt(blogid),
            userId : req.user.id
        }
    });
    res.json({message : "like added successfully" , data : like});
});

module.exports = router;