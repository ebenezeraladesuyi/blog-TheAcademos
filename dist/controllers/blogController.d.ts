import type { AuthRequest } from "../middleware/auth.js";
import type { Response } from "express";
export declare const getAllBlogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBlogById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const toggleLike: (req: AuthRequest, res: Response) => Promise<void>;
export declare const addComment: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteComment: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=blogController.d.ts.map