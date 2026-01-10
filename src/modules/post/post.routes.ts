import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth, UserRole } from "../../middleware/authentication";

const router = express.Router();

router.get("/", PostController.getAllPost);
router.post("/", auth(UserRole.USER), PostController.createPost);
router.get("/:id", PostController.getPostById);
export const PostRoutes = router;
