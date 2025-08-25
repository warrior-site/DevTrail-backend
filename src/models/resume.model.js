import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ✅ Basic Info
    personalInfo: {
      fullName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String },
      location: { type: String },
      linkedIn: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },

    // ✅ Summary
    summary: { type: String, maxlength: 1000 },

    // ✅ Work Experience
    experience: [
      {
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String, maxlength: 1500 },
        achievements: [{ type: String }],
      },
    ],

    // ✅ Education
    education: [
      {
        school: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        achievements: [{ type: String }],
      },
    ],

    // ✅ Projects
    projects: [
      {
        name: { type: String },
        description: { type: String, maxlength: 1000 },
        technologies: [{ type: String }],
        link: { type: String },
      },
    ],

    // ✅ Skills
    skills: [{ type: String }],

    // ✅ Extra
    certifications: [{ name: String, issuer: String, date: Date }],
    awards: [{ title: String, issuer: String, date: Date }],
    languages: [{ name: String, proficiency: String }],

    // ✅ Resume Management
    title: { type: String, default: "My Resume" }, // user can rename
    draft: { type: Boolean, default: true }, // still editable
    status: { type: String, enum: ["draft", "final"], default: "draft" }, // final when user confirms
    settings: {
      visibility: { type: Boolean, default: true },
      lastUpdated: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
