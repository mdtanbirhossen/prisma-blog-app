import express from "express";
import { PostRoutes } from "./modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true,
}))
app.use(express.json());

// better auth routes
app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use("/posts", PostRoutes);

app.get("/",(req,res)=>{
    res.send("Hello, World!")
})

export default app;