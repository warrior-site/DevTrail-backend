import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
    // trim: true,
    // minlength: 3,
  },
  email: { 
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  githubUsername: {
    type: String,
  },

  // 🆕 Profile fields
  bio: {
    type: String,
    default: "",
    maxlength: 300,
  },
  avatar: {
    type: String, // profile image
    default: "https://your-app.com/default-avatar.png",
  },
  backgroundImage: {
    type: String, // cover/banner
    default: "https://your-app.com/default-bg.png",
  },

  // 🆕 Social Links
  socialLinks: {
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    website: { type: String, default: "" },
  },

  // 🆕 Journal/Contribution Dates
  journalDates: [
    {
      date: { type: Date, required: true },
      count: { type: Number, default: 1 }, // journals on that day
    },
  ],

  // 🆕 Counts / Stats
  projectCount: {
    type: Number,
    default: 0,
  },
  journalCount: {
    type: Number,
    default: 0,
  },
  repoCount: {
    type: Number,
    default: 0,
  },

  // 🆕 Recommended extras
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
