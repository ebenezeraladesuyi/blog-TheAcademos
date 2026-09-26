import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "blog-covers",
        allowed_formats: ["jpg", "jpeg", "webp"],
        transformation: [{ width: 1200, height: 630, crop: "limit" }]
    })
});
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("cloudinary delete error:", error);
    }
};
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map