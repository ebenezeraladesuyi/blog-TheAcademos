import mongoose, { Document, Schema, Types } from "mongoose";
const commentSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        types: String,
        required: true,
        lowercase: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    ip: {
        type: String,
    },
}, {
    timestamps: true,
});
const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        tyoe: String,
        required: true,
    },
    excerpt: {
        type: String,
        trim: true,
    },
    coverImage: {
        type: String,
    },
    coverImagePublicId: {
        type: String,
    },
    tags: [{
            type: String,
            trim: true,
        }],
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    likes: [{
            type: String,
        }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [
        commentSchema
    ],
}, {
    timestamps: true,
});
const blogModel = mongoose.model("blogs", blogSchema);
export default blogModel;
//# sourceMappingURL=blogModel.js.map