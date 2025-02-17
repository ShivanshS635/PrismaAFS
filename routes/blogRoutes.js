const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
const prisma = new PrismaClient();

router.post("/" , isLoggedIn , async (req , res) => {

    const {title , description } = req.body;
    console.log(req.user);
    const newBlog = await prisma.blog.create({
        data : {
            Title : title,
            description : description,
            authorId : req.user.id
        }
    });
    res.json({message : "blog added successfully" , data : newBlog});
});

router.get("/" , async(req , res) => {
    try{
        const blogs = await prisma.blog.findMany();
        res.json({data : blogs});
    }catch(err){    
        res.json({error : err.message});
    }
});

router.get("/:id" , async(req , res) => {
    const id = req.params;
    const blogs = await prisma.blog.findUnique({
        where : {
            id : parseInt(id.id)
        }
    });
    res.json({data : blogs});
});

module.exports = router;