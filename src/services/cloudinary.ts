import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: any, file: any) => ({
        folder: "blog-covers",
        allowed_formats: ["jpg", "jpeg", "webp"],
        transformation: [{ width: 1200, height: 630, crop: "limit" }]
    })
})

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("cloudinary delete error:", error )
    }
}

export default cloudinary