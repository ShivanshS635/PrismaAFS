const express = require("express");
const router= express.Router();
const { PrismaClient } = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
const prisma = new PrismaClient();


router.post("/:blogId",isLoggedIn,async(req,res)=>{
    const {blogId} = req.params;
    const userId = req.user.id;
    const newLike= await prisma.like.create({
        data:{
          authorId:userId,
          blogId:parseInt(blogId) 
        }
    })
    console.log(newLike)
    let updatelikecount= await prisma.blog.update({
        where:{
            id:parseInt(blogId)
        },
        data:{
            likecount:{increment:1}
        }

    })
    console.log(updatelikecount)
    res.send("Liked successfully")

})

router.delete("/:blogId", isLoggedIn, async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user.id;
    const deleted = await prisma.like.deleteMany({
        where: {
            blogId: parseInt(blogId),
            authorId: userId
        }
    });
    if (deleted.count > 0) {
        await prisma.blog.update({
            where: { id: parseInt(blogId) },
            data: { likecount: { decrement: 1 } }
        });
        res.send("Like removed successfully");
    } else {
        res.status(404).send("Like not found");
    }
});

module.exports = router;