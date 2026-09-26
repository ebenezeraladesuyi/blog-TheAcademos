import blogAdminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
// create admin
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "all fields required"
            });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "password too short"
            });
            return;
        }
        const exists = await blogAdminModel.findOne({ email });
        if (exists) {
            res.status(400).json({
                success: false,
                message: "Email already in use"
            });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const admin = await blogAdminModel.create({
            name,
            email,
            password: hashed,
            role: "admin"
        });
        res.status(201).json({
            success: true,
            message: "Admin created",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error:", error
        });
    }
};
// get all admin
export const getAllAdmins = async (_req, res) => {
    try {
        const admins = await blogAdminModel.find({ role: "admin" }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error:", error
        });
    }
};
// delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || typeof id !== 'string') {
            res.status(400).json({
                success: false,
                message: "invalid ID format"
            });
            return;
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "invalid ID"
            });
            return;
        }
        const admin = await blogAdminModel.findById(id);
        if (!admin) {
            res.status(400).json({
                success: false,
                message: "Admin not found"
            });
            return;
        }
        ;
        if (admin.role === "superAdmin") {
            res.status(403).json({
                success: false,
                message: "cannot delete superAdmin"
            });
            return;
        }
        await admin.deleteOne();
        res.status(200).json({
            success: true,
            message: "Admin deleted"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error:", error,
        });
    }
};
//# sourceMappingURL=superAdminContoller.js.map