const express = require('express');
const app = express();
app.use(express.json());

const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/users/:email', async (req, res) => {
    const {email} = req.params;

    const user = await prisma.user.findUnique({
        where:{
            email : email
        }
    })
    res.json({user});
});

app.post('/users', async (req, res) => {
    const {email, name} = req.body;
    let newUser = await prisma.user.create({
        data : {
            email : email,
            name : name
        }
    });
    res.json({newUser});
});

app.delete('/users/:email', (req, res) => {
    const {email} = req.params;
    const user = prisma.user.delete({
        where:{
            email : email
        }
    });
    res.send("User Deleted");
});

app.put('/users', (req, res) => {

});

app.listen(4545 , () => {
    console.log("Server Started at http://localhost:4545");
})