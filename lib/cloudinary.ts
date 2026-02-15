import { v2 as cloudinary } from "cloudinary";

const config = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.replace(/['"]/g, '').trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.replace(/['"]/g, '').trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.replace(/['"]/g, '').trim(),
    secure: true,
};

if (!config.cloud_name || !config.api_key || !config.api_secret) {
    console.error("Cloudinary Configuration Error: Missing or empty environment variables in .env.local");
} else {
    console.log("Cloudinary Configured for Cloud:", config.cloud_name);
    // Logging lengths for debugging without leaking secrets
    console.log(`Key length: ${config.api_key?.length}, Secret length: ${config.api_secret?.length}`);
}

cloudinary.config(config);

// Fix SSL certificate issue in development
if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export default cloudinary;
