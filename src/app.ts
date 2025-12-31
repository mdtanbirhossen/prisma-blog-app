import express from "express";
import { PostRoutes } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";


const app = express();
app.use(express.json());


app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use("/posts", PostRoutes);

app.get("/",(req,res)=>{
    res.send("Hello, World!")
})

export default app;