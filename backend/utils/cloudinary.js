const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// cloudinary Upload image
const cloudinaryUploadImage = async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'profile_photos',
      });
      // Remove the file from the server after uploading
    //   fs.unlinkSync(filePath);
      return result;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
// cloudinary Delete image
const cloudinaryDeleteImage = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {cloudinaryUploadImage, cloudinaryDeleteImage};