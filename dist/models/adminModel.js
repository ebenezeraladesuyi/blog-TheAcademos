import mongoose, { Document, Schema } from "mongoose";
const blogAdminSchema = new Schema({
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
}, {
    timestamps: true,
});
const blogAdminModel = mongoose.model("blogAdmin", blogAdminSchema);
export default blogAdminModel;
//# sourceMappingURL=adminModel.js.map