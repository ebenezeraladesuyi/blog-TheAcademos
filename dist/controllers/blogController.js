import crypto from "crypto";
import blogModel from "../models/blogModel.js";
import mongoose from "mongoose";
import { deleteImage } from "../services/cloudinary.js";
// helper: hash IP so we don't store raw IPs
const hashIp = (ip) => crypto.createHash("sha256").update(ip).digest("hex").slice(0, 32);
// helper get IP
const getIp = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) ?? req.socket.remoteAddress ?? req.ip ?? "unknown";
    // req.socket.remoteAddress || req.ip || "unknown";
    // return hashIp(ip!.trim());
    return hashIp(ip.trim());
};
// get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const { search, tag } = req.query;
        const filter = {};
        if (search)
            filter.title = { $regex: search, $options: "i" };
        if (tag)
            filter.tags = tag;
        const blogs = await blogModel.find(filter).populate("author", "name email").sort({ createdAt: -1 }).select("-comments");
        res.status(200).json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
        console.log("error", error);
    }
};
// getBlogById
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid blog id"
            });
            return;
        }
        const blog = await blogModel.findById(id).populate("author", "name email");
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found"
            });
            return;
        }
        const ipHash = getIp(req);
        const hasLiked = blog.likes.includes(ipHash);
        res.status(200).json({
            success: true,
            data: { ...blog.toObject(), hasLikedByYou: hasLiked }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
        console.log("error", error);
    }
};
//  Like a blog (+1)
export const likeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found",
            });
            return;
        }
        blog.likeCount = (blog.likeCount || 0) + 1;
        await blog.save();
        res.status(200).json({
            success: true,
            message: "Liked",
            data: { likeCount: blog.likeCount },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error,
        });
    }
};
// Unlike a blog (-1, never below 0)
export const unlikeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found",
            });
            return;
        }
        blog.likeCount = Math.max(0, (blog.likeCount || 0) - 1);
        await blog.save();
        res.status(200).json({
            success: true,
            message: "Unliked",
            data: { likeCount: blog.likeCount },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error,
        });
    }
};
// toggle like and unlike 
export const likeAndUnlikeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // "like" | "unlike"
        if (action !== "like" && action !== "unlike") {
            res.status(400).json({
                success: false,
                message: "action must be 'like' or 'unlike'",
            });
            return;
        }
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found",
            });
            return;
        }
        if (action === "like") {
            blog.likeCount = (blog.likeCount || 0) + 1;
        }
        else {
            // "unlike" — never go below 0
            blog.likeCount = Math.max(0, (blog.likeCount || 0) - 1);
        }
        await blog.save();
        res.status(200).json({
            success: true,
            message: action === "like" ? "Liked" : "Unliked",
            data: { likeCount: blog.likeCount },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error",
            error,
        });
    }
};
// toggle like
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found"
            });
            return;
        }
        const ipHash = getIp(req);
        const alreadyLiked = blog.likes.includes(ipHash);
        if (alreadyLiked) {
            blog.likes = blog.likes.filter((h) => h !== ipHash);
        }
        else {
            blog.likes.push(ipHash);
        }
        blog.likeCount = blog.likes.length;
        await blog.save();
        res.status(200).json({
            success: true,
            message: alreadyLiked ? "Unliked" : "Liked",
            data: { likeCount: blog.likeCount, hasLiked: !alreadyLiked }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
    }
};
// add comment
export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, text } = req.body;
        if (!name || !text) {
            res.status(400).json({
                success: false,
                message: "Name or Text required"
            });
            return;
        }
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                succes: false,
                message: "blog not found"
            });
            return;
        }
        blog.comments.push({ name, text, ip: getIp(req) });
        await blog.save();
        const added = blog.comments[blog.comments.length - 1];
        res.status(201).json({
            success: true,
            message: "comment added",
            data: added,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
    }
};
// ADMIN ROUTES
// create blog
export const createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, tags } = req.body;
        if (!title || !content) {
            res.status(400).json({
                success: false,
                message: "Title and Content required"
            });
            return;
        }
        const file = req.file;
        const blog = await blogModel.create({
            title,
            content,
            excerpt,
            tags: typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags || [],
            author: req.user._id,
            coverImage: file?.path,
            coverImagePublicId: file?.filename,
        });
        res.status(201).json({
            success: true,
            message: "blog created",
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
    }
};
// update blog
export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found",
            });
            return;
        }
        const { title, content, excerpt, tags } = req.body;
        const file = req.file;
        // if new image uploaded, delete the old one
        if (file && blog.coverImagePublicId) {
            await deleteImage(blog.coverImagePublicId);
        }
        blog.title = title ?? blog.title;
        blog.content = content ?? blog.content;
        blog.excerpt = excerpt ?? blog.excerpt;
        if (tags) {
            blog.tags = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
        }
        if (file) {
            blog.coverImage = file.path;
            blog.coverImagePublicId = file.filename;
        }
        const updated = await blog.save();
        res.status(200).json({
            success: true,
            message: "Blog updated",
            data: updated,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            messsage: "server error", error
        });
    }
};
// delete blog
export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog not found"
            });
            return;
        }
        if (blog.coverImagePublicId) {
            await deleteImage(blog.coverImagePublicId);
        }
        await blog.deleteOne();
        res.status(200).json({
            success: true,
            message: "blog deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
    }
};
// delete comment
export const deleteComment = async (req, res) => {
    try {
        const { id, commentId } = req.params;
        const blog = await blogModel.findById();
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "blog not found"
            });
            return;
        }
        blog.comments = blog.comments.filter((c) => c._id?.toString() !== commentId);
        await blog.save();
        res.status(200).json({
            success: true,
            message: "comment deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error", error
        });
    }
};
//# sourceMappingURL=blogController.js.map