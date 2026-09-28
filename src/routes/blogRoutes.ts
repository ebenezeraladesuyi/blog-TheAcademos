import { Router } from "express";
import { addComment, createBlog, deleteBlog, deleteComment, getAllBlogs, getBlogById, likeBlog, toggleLike, unlikeBlog, updateBlog } from "../controllers/blogController.js";
import { adminOnly, protect } from "../middleware/auth.js";
import { upload } from "../services/cloudinary.js";



const blogRouter = Router();

// PUBLIC ROUTES
blogRouter.get("/getall", getAllBlogs);
blogRouter.get("/getbyid/:id", getBlogById);
blogRouter.post("/:id/like", likeBlog)
blogRouter.post("/:id/unlike", unlikeBlog)
blogRouter.post("/:id/togglelike", toggleLike)
blogRouter.post("/:id/comments", addComment);


// ADMIN ONLY
blogRouter.post("/create", protect, adminOnly, upload.single("coverImage"), createBlog)
blogRouter.put("/update/:id", protect, adminOnly, upload.single("coverImage"), updateBlog);
blogRouter.delete("/delete/:id", protect, adminOnly, deleteBlog);
blogRouter.delete("/delete/:id/comments/:commentId", protect, adminOnly, deleteComment)


export default blogRouter;