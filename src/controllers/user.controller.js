import cloudinary from "../config/cloudinary.config.js";
import { updateUser } from "../dao/user.dao.js";
import fs from "fs";

export const updateUserProfile = async (req, res) => {
  const {bio,username,githubUsername,socialLinks} = req.body;
  const { userId } = req.params;

  try {
    // ✅ Collect updateData
    let updateData = {
      ...(username && { username }),
      ...(githubUsername && { githubUsername }),
      ...(bio && { bio }),
      ...(socialLinks && { socialLinks: JSON.parse(socialLinks) }),
    };

    // ✅ Upload Avatar (unsigned)
    if (req.files?.avatar?.[0]?.path) {
      const avatarPath = req.files.avatar[0].path;
      const result = await cloudinary.uploader.upload(avatarPath);
      updateData.avatar = result.secure_url;

      // cleanup local file
      fs.unlink(avatarPath, (err) =>
        err && console.error("Error deleting avatar file:", err)
      );
    }

    // ✅ Upload Background Image (unsigned)
    if (req.files?.backgroundImage?.[0]?.path) {
      const bgPath = req.files.backgroundImage[0].path;
      const result = await cloudinary.uploader.upload(bgPath, {
        upload_preset: "managify", // 🔥 unsigned preset name
      });
      updateData.backgroundImage = result.secure_url;

      // cleanup local file
      fs.unlink(bgPath, (err) =>
        err && console.error("Error deleting background file:", err)
      );
    }
    console.log("Update data prepared:", updateData);
    // ✅ Update user in DB
    const user = await updateUser(userId, updateData);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log("User updated successfully:", user);
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error during user update:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
