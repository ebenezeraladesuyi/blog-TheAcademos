import mongoose, { Document, Schema } from "mongoose";

export type Role = "admin" | "superAdmin"

export interface IblogAdmin extends Document{
    name: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}

const blogAdminSchema = new Schema<IblogAdmin>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "superAdmin"],
            default: "admin"
        },
    },
    {
        timestamps: true,
    }
)

const blogAdminModel = mongoose.model<IblogAdmin>("blogAdmin", blogAdminSchema)

export default blogAdminModel