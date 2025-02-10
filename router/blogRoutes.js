const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

router.post("/" , async (req , res) => {
    const {title , description , authorId} = req.body;
    const newBlog = await prisma.blog.create({
        data : {
            Title : title,
            description : description,
            authorId : authorId
        }
    });
    res.json({message : "blog added successfully" , data : newBlog});
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