import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import { auth as betterAuth } from "../../lib/auth";
import { Extensions } from "@prisma/client/runtime/client";
const router = express.Router();

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get user session
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email to access this resource",
        success: false,
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };
    console.log(session);
    console.log(roles);
    next();
  };
};

router.post("/", auth(UserRole.USER), PostController.createPost);

export const PostRoutes = router;
