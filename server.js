const express = require('express');
const app = express();

app.use(express.json());

app.use("/api/user" , require("./router/userRoutes"));
app.use("/api/blogs",require("./router/blogRoutes"));

app.listen(4545 , () => {
    console.log("Server Started at http://localhost:4545");
})