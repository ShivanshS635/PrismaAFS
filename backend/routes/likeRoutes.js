const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const isLoggedIn = require("../middleware/verifyLogin");
const prisma = new PrismaClient();

router.post("/:blogId", isLoggedIn, async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const userId = req.user.id;

        const existingLike = await prisma.like.findFirst({
            where: {
                userId: userId,
                blogId: blogId
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });

            await prisma.blog.update({
                where: { id: blogId },
                data: { likeCount: { decrement: 1 } }
            });

            return res.json({ liked: false, message: "Blog unliked successfully" });
        }

        await prisma.like.create({
            data: {
                userId: userId,
                blogId: blogId
            }
        });

        await prisma.blog.update({
            where: { id: blogId },
            data: { likeCount: { increment: 1 } }
        });

        res.json({ liked: true, message: "Blog liked successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:blogId/check", isLoggedIn, async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const userId = req.user.id;

        const like = await prisma.like.findFirst({
            where: {
                userId: userId,
                blogId: blogId
            }
        });

        res.json({ liked: !!like });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:blogId/count", async (req, res) => {
    try {
        const blogId = parseInt(req.params.blogId);
        const blog = await prisma.blog.findUnique({
            where: { id: blogId },
            select: { likeCount: true }
        });
        
        res.json({ count: blog?.likeCount || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;