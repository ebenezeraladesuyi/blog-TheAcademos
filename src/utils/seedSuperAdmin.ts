import bcrypt from "bcryptjs";
import blogAdminModel from "../models/adminModel.js";

export const seedSuperAdmin = async (): Promise<void> => { 
    try {
        const name = process.env.SUPER_ADMIN_NAME;
        const email = process.env.SUPER_ADMIN_EMAIL; 
        const password = process.env.SUPER_ADMIN_PASSWORD;

        // console.log("Admin-name", name)
        // console.log("Admin-email", email)

        if (!name || !email || !password) {
            console.warn("SuperAdmin name, email or password not set; skipping seed");
            return
        }

        const existing = await blogAdminModel.findOne({ email })
        if (existing) {
            console.log(("superAdmin already exist"));
            return
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        
        await blogAdminModel.create({
            name,
            email, 
            password: hashed,
            role: "superAdmin"
        })

        // console.log(`SuperAdmin seeded: ${email}`)

    } catch (error) {
     console.error("SuperAdmin seed failed:", error)   
    }
}