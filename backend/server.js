const express = require('express');
const app = express();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors'); 
const isLoggedIn = require('./middleware/verifyLogin');

app.use(cors());
app.use(express.json());

app.use("/api/user" , require("./routes/userRoutes"));
app.use("/api/blogs",require("./routes/blogRoutes"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/likes",require("./routes/likeRoutes"));
app.use("/api/admin",isLoggedIn, require("./routes/adminRoutes"));
app.get("/verify/:token/:userId", async (req,res) => {
    const {token,userId} = req.params;
    const isToken = await prisma.token.findFirst({
        where:{
            token : token,
            userId : parseInt(userId)
        }
    });
    if(isToken){
        await prisma.user.update({
            where:{
                id : parseInt(userId)
            },
            data:{
                verified : true
            }
        });
        res.send("User Verified");
    }else{
        res.send("Invalid Token");
    }
});

app.get("/" , (req,res) => {
    res.send("Hello World");
})

app.listen(4545 , () => {
    console.log("Server Started at https://prismaafs.onrender.com");
})