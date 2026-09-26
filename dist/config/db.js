import mongoose from "mongoose";
import { seedSuperAdmin } from "../utils/seedSuperAdmin.js";
const uri = process.env.MONGOOSE_DB;
// console.log("uri", uri)
const connectDB = async () => {
    try {
        if (!uri) {
            throw new Error("MONGOOSE_DB is missing from your environment");
        }
        await mongoose.connect(uri);
        console.log("MONGODB connected to server");
        await seedSuperAdmin();
    }
    catch (error) {
        console.error("MONGODB connection failed", error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map