import blogAdminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
// import { rmSync } from "node:fs";
// login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "all fields required"
            });
            return;
        }
        const user = await blogAdminModel.findOne({ email }).select("+password");
        if (!user) {
            res.status(401).json({
                success: false,
                message: "invalid credentials"
            });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "invlid credentials"
            });
            return;
        }
        res.status(200).json({
            success: true,
            name: "login successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString())
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
// change-password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "All fields required"
            });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
            return;
        }
        const user = await blogAdminModel.findById(req.user._id).select("+password");
        if (!user) {
            res.status(404).json({
                success: false,
                message: "user not found"
            });
            return;
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: "Current password is wrong"
            });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "server error:", error
        });
    }
};
//# sourceMappingURL=authController.js.map