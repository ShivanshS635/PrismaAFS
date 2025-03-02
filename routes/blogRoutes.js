const express = require("express");
const router = express.Router();

const {PrismaClient} = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
const prisma = new PrismaClient();

router.post("/" , isLoggedIn , async (req , res) => {
    const {title , description, premium } = req.body;
    const newBlog = await prisma.blog.create({
        data : {
            Title : title,
            description : description,
            authorId : req.user.id,
            verified: false,
            premium: premium || false,
        }
    });
    res.json({message : "blog added successfully" , data : newBlog});
});

router.get("/" , async(req , res) => {
    try{
        const blogs = await prisma.blog.findMany({
            where: {
                verified: true
            }
        });
        res.json({data : blogs});
    }catch(err){    
        res.json({error : err.message});
    }
});

// router.get("/:id" , async(req , res) => {
//   const id = req.params;
//   const blogs = await prisma.blog.findUnique({
//       where : {
//         id : parseInt(id.id)
//       }
//   });
//   res.json({data : blogs});
// });

router.post("/purchase/:id", isLoggedIn, async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const userId = req.user.id;

    const existingPurchase = await prisma.premiumPurchase.findFirst({
      where: {
        userId: userId,
        blogId: blogId
      }
    });

    if (existingPurchase) {
      return res.json({ message: "Already purchased" });
    }

    await prisma.premiumPurchase.create({
      data: {
        userId: userId,
        blogId: blogId
      }
    });

    res.json({ message: "Purchase successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/checkPurchase/:id", isLoggedIn, async (req, res) => {
  const purchase = await prisma.premiumPurchase.findFirst({
    where: {
      userId: req.user.id,
      blogId: parseInt(req.params.id)
    }
  });
  res.json({ purchased: !!purchase });
});

router.get("/purchases", isLoggedIn, async (req, res) => {
  try {
    const purchases = await prisma.premiumPurchase.findMany({
      where: {
        userId: req.user.id
      }
    });
    res.json({ purchases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async(req, res) => {
  try {
    console.log(req.params.id)
      const blogId = parseInt(req.params.id);
      console.log(blogId)
      const blog = await prisma.blog.findUnique({
          where: {
              id: blogId
          },
          include: {
              author: {
                  select: {
                      name: true,
                      email: true
                  }
              }
          }
      });
      console.log(blog)
      if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
      }
      
      res.json({ data: blog });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;