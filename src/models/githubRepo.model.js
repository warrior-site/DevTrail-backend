import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true // ✅ helps fast queries when fetching repos by user
    },
    repos: [
      {
        id: { type: Number, required: true }, // ✅ GitHub repo ID
        name: { type: String, required: true, trim: true }, // ✅ required + clean
        description: { type: String, default: "" },
        url: { type: String, required: true, unique: false }, // unique: false -> user may fork same repo later
        stars: { type: Number, default: 0 },
        forks: { type: Number, default: 0 },
        language: { type: String, default: "Unknown" },
        updatedAt: { type: Date }
      }
    ],
    lastSynced: { type: Date, default: Date.now }
  },
  {
    timestamps: true // ✅ adds createdAt & updatedAt automatically
  }
);

const GithubRepo = mongoose.model("GithubRepo", repoSchema);

export default GithubRepo;
