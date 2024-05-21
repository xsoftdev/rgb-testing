import { v2 as cloudinary } from "cloudinary";
const config = useRuntimeConfig()
cloudinary.config({
  cloud_name: config.privateRuntimeConfig.cloudinary_cloud_name,
  api_key: config.privateRuntimeConfig.cloudinary_api_key,
  api_secret: config.privateRuntimeConfig.cloudinary_api_secret,
});

export default cloudinary;