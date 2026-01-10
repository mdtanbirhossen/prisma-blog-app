import { Request, Response } from "express";
import { PostService } from "./post.service";
import paginationSortingHelper from "../../utils/paginationSorting";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await PostService.createPost(req.body, user.id);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    console.log("Tags:", tags);
    console.log("Search:", search);

    const { page, limit, sortBy, sortOrder, skip } = paginationSortingHelper(
      req.query as any
    );
    const result = await PostService.getAllPosts({
      search: search as string | undefined,
      tags,
      page,
      limit,
      sortBy,
      sortOrder,
      skip,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id)
    const result = await PostService.getPostById(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const PostController = {
  createPost,
  getAllPost,
  getPostById,
};
