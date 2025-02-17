const express = require('express');
const app = express();
const cors = require('cors'); 

app.use(cors());
app.use(express.json());

app.use("/api/user" , require("./routes/userRoutes"));
app.use("/api/blogs",require("./routes/blogRoutes"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/like",require("./routes/likeRoutes"));

app.get("/" , (req,res) => {
    res.send("Hello World");
})

app.listen(4545 , () => {
    console.log("Server Started at http://localhost:4545");
})