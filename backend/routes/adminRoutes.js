const express = require("express");
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { sendEmail } = require('../utils/emailService');
const isLoggedIn = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "JWT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token." });
    }
};

const isAdmin = async (req, res, next) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
    next();
};

router.get('/users',isLoggedIn, isAdmin, async (req, res) => {
    try {
        
        const users = await prisma.user.findMany();
        console.log(users)
        const userList = users.filter((users) => users.id !== req.user.id);
        console.log(userList)
        res.json({ data: userList });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

router.delete('/users/:userId',isLoggedIn, isAdmin, async (req, res) => {
    const { userId } = req.params;
    const loggedInUserId = req.user.id;

    if (parseInt(userId) === loggedInUserId) {
        return res.status(400).json({ message: "Admin cannot delete their own account." });
    }

    try {
        await prisma.blog.deleteMany({
            where: { authorId: parseInt(userId) }
        });

        await prisma.user.delete({
            where: { id: parseInt(userId) }
        });

        res.json({ message: "User and associated blogs deleted successfully" });
    } catch (error) {
        console.error("Error deleting user and blogs:", error);
        res.status(500).json({ message: "Failed to delete user and blogs" });
    }
});

router.put('/users/:userId/set-admin',isLoggedIn, isAdmin, async (req, res) => {
    const { userId } = req.params;

    try {
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isAdmin: true }
        });

        res.json({ message: "User set as admin successfully" });
    } catch (error) {
        console.error("Error setting user as admin:", error);
        res.status(500).json({ message: "Failed to set user as admin" });
    }
});

router.put('/users/:userId/remove-admin', isLoggedIn, isAdmin, async (req, res) => {
    const { userId } = req.params;

    try {
        await prisma.user.update({
            where: { id: parseInt(userId) },
            data: { isAdmin: false }
        });

        res.json({ message: "Admin privileges removed successfully" });
    } catch (error) {
        console.error("Error removing admin privileges:", error);
        res.status(500).json({ message: "Failed to remove admin privileges" });
    }
});
 
router.get('/blogs',isLoggedIn, isAdmin, async (req, res) => {
    try {
        const blogs = await prisma.blog.findMany();
        res.json({ data: blogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ message: "Failed to fetch blogs" });
    }
});

router.put('/blogs/:blogId/reject',isLoggedIn, isAdmin, async (req, res) => {
    const { blogId } = req.params;
    const { rejectionReason } = req.body;
    const adminUser = await prisma.user.findFirst({ where: { isAdmin: true } });

    if (!rejectionReason) {
        return res.status(400).json({ message: "Rejection reason is required" });
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: parseInt(blogId) },
            include: { author: true }                                                                          
        });                                                                                                                                            ''
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        await prisma.blog.delete({
            where: { id: parseInt(blogId) }
        });

        await sendEmail({
            from : adminUser.email,
            to: blog.author.email,
            subject: 'Blog Rejected',
            text: `Your blog "${blog.Title}" has been rejected. Reason: ${rejectionReason}`
        });

        res.json({ message: "Blog rejected successfully" });
    } catch (error) {
        console.error("Error rejecting blog:", error);
        res.status(500).json({ message: "Failed to reject blog" });
    }
});

router.put('/blogs/:blogId/verify',isLoggedIn, isAdmin, async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: parseInt(blogId) },
            include: { author: true }
        });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        await prisma.blog.update({
            where: { id: parseInt(blogId) },
            data: { verified: true }
        });

        await sendEmail({
            to: blog.author.email,
            subject: 'Blog Verified',
            text: `Your blog "${blog.Title}" has been verified and is now live!`
        });

        res.json({ message: "Blog verified successfully" });
    } catch (error) {
        console.error("Error verifying blog:", error);
        res.status(500).json({ message: "Failed to verify blog" });
    }
});

module.exports = router;