import mongoose, { Document, Schema, Types } from "mongoose";

export interface IComment {
    _id?: Types.ObjectId;
    name: string;
    email?: string;
    text: string;
    ip?: string;
    createdAt?: Date;
}

export interface IBlog extends Document {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string; // cloudinary URL
    coverImagePublicId?: string; // for deletion
    tags: string[];
    author: Types.ObjectId;
    likes: string[]; // IP addresses (hashed) of likers
    likeCount: number;
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment> (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
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
    },
    {
        timestamps: true,
    }
)

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
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
    },
    {
        timestamps: true,
    }
)

const blogModel = mongoose.model<IBlog>("blogs", blogSchema)

export default blogModel;