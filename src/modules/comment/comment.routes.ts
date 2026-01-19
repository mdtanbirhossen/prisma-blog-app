import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import { auth, UserRole } from "../../middleware/authentication";
const router = express.Router();

router.get("/author/:authorId", CommentController.getCommentsByAuthorId);
router.get("/:commentId", CommentController.getCommentById);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  CommentController.createComment,
);
export const CommentRoutes: Router = router;
