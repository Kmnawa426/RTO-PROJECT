
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// import cloudinary from "../Database/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
configDotenv()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const Upload = multer({
  storage: storage,
});

export default Upload;