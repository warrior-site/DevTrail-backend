import Resume from "../models/resume.model.js";
import Repo from "../models/githubRepo.model.js";
import Project from "../models/project.model.js";
import Journal from "../models/journal.model.js";
// import Insight from "../models/insight.model.js";
import User from "../models/user.model.js";
import { generateResumeWithAI } from "../service/gemini.service.js";

// ✅ Utility to sanitize date fields
function sanitizeDate(value) {
  return value && !isNaN(Date.parse(value)) ? new Date(value) : null;
}

function sanitizeExperience(experienceArr = []) {
  return experienceArr.map(exp => ({
    ...exp,
    startDate: sanitizeDate(exp.startDate),
    endDate: sanitizeDate(exp.endDate),
  }));
}

function sanitizeEducation(educationArr = []) {
  return educationArr.map(edu => ({
    ...edu,
    startDate: sanitizeDate(edu.startDate),
    endDate: sanitizeDate(edu.endDate),
  }));
}

export const autoGenerateResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    // 🔹 Step 1: Fetch everything from DB
    const [user, reposDoc, projectsDoc, journals] = await Promise.all([
      User.findById(userId),
      Repo.findOne({ userId }),
      Project.find({ userId }),
      Journal.find({ userId, isStarred: true }), // only starred journals
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const repos = reposDoc ? reposDoc.repos : [];
    const projects = projectsDoc || [];

    if (!repos.length && !projects.length && !journals.length) {
      return res.status(400).json({ error: "No data found to generate resume" });
    }

    // 🔹 Step 2: Format data for AI
    const formattedData = {
      user: {
        username: user.username,
        email: user.email,
        bio: user.bio,
        githubUsername: user.githubUsername,
        socialLinks: user.socialLinks,
      },
      repos: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.url,
        language: repo.language,
      })),
      projects: projects.map(p => ({
        title: p.title,
        description: p.description,
        techStack: p.techStack || [],
        link: p.link || "",
      })),
      journals: journals.map(j => ({
        title: j.title,
        content: j.content,
        createdAt: j.createdAt,
      })),
    };

    const instruction = `
Generate a professional resume JSON based on this schema:

- personalInfo: fullName, email, phone, location, linkedIn, github, portfolio
- summary: A strong 3–4 line professional summary
- skills: Extract and infer relevant technical + soft skills
- experience: Convert repos/projects into work-like entries (jobTitle, company, startDate, endDate, description, achievements). If dates unknown, use null.
- education: Leave empty if not available. If dates unknown, use null.
- projects: Use provided projects but polish names/descriptions (include technologies + links)
- achievements: Infer from projects/journals
- insights: Turn into bullet points
- certifications, awards, languages: Leave empty if not available

⚠️ Output strict JSON aligned to schema fields.
    `;

    // 🔹 Step 3: Call AI
    const aiResume = await generateResumeWithAI(formattedData, instruction);

    // 🔹 Step 4: Build DB object aligned with Resume schema
    const resumeData = {
      userId,
      personalInfo: {
        fullName: user.username,
        email: user.email,
        phone: "", // cannot auto fetch
        location: "", // cannot auto fetch
        linkedIn: user.socialLinks?.linkedin || "",
        github: `https://github.com/${user.githubUsername}` || "",
        portfolio: user.socialLinks?.website || "",
      },
      summary: aiResume.summary || user.bio || "",
      skills: aiResume.skills || [],
      experience: sanitizeExperience(aiResume.experience || []), // ✅ fixed
      education: sanitizeEducation(aiResume.education || []),   // ✅ fixed
      projects: (aiResume.projects || []).map(p => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies || [],
        link: p.link || "",
      })),
      certifications: aiResume.certifications || [],
      awards: aiResume.awards || [],
      languages: aiResume.languages || [],
      title: "My Auto-Generated Resume",
      draft: true,
      status: "draft",
      settings: {
        visibility: true,
        lastUpdated: new Date(),
      },
    };

    // 🔹 Step 5: Save or Update (if resume already exists for user)
    const savedResume = await Resume.findOneAndUpdate(
      { userId },
      resumeData,
      { new: true, upsert: true } // upsert = create if not exists
    );

    // 🔹 Step 6: Respond
    return res.json({
      success: true,
      data: aiResume,
      dbObject: savedResume,
    });

  } catch (error) {
    console.error("AutoGenerateResume Error:", error);
    res.status(500).json({ error: "Failed to auto-generate resume" });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userId } = req.body; // assuming userId comes from req.body (or from auth middleware)
    const updateData = req.body.update || {}; // all updatable fields in a nested object

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ error: "No update data provided" });
    }

    // ✅ Build $set object dynamically
    const setFields = {};
    for (const key in updateData) {
      if (updateData[key] !== undefined) {
        setFields[key] = updateData[key];
      }
    }

    // ✅ Update resume
    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { $set: setFields, "settings.lastUpdated": new Date() },
      { new: true } // return updated doc
    );

    if (!updatedResume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    return res.json({
      success: true,
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("UpdateResume Error:", error);
    res.status(500).json({ error: "Failed to update resume" });
  }
};

export const deleteEitherOneProjectOrRepo = async (req,res)=>{
    const {userId, type, id} = req.body;

    try {
       if (!userId || !type || !id) {
           return res.status(400).json({ error: "UserId, type, and id are required" });
       }
       
    // 🔹 Step 1: Find the resume
    const resume = await Resume.findOne({ userId });
    if (!resume) {
        return res.status(404).json({ error: "Resume not found" });
    }

    // 🔹 Step 2: Remove the project or repo
    if (type === "project") {
        resume.projects = resume.projects.filter(p => p.id !== id);
    } else if (type === "repo") {
        resume.repos = resume.repos.filter(r => r.id !== id);
    } else {
        return res.status(400).json({ error: "Invalid type. Use 'project' or 'repo'." });
    }

    // 🔹 Step 3: Save the updated resume
    await resume.save();

    return res.json({
        success: true,
        message: "Project/Repo deleted successfully",
        resume
    });


   } catch (error) {
       console.error("DeleteProjectOrRepo Error:", error);
       return res.status(500).json({ error: "Failed to delete project or repo" });
   }
};

export const polishResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    // 🔹 Step 1: Get resume
    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // 🔹 Step 2: Instruction for AI
    const instruction = `
Polish and rewrite the provided resume data into professional, concise, and ATS-friendly text. 
Keep the meaning intact but improve grammar, clarity, formatting, and impact. 
Do not invent fake information — only refine and structure what is provided.

Rules for polishing:
- personalInfo → Keep factual (name, email, phone, links), only format properly.
- summary → Rewrite as a strong professional summary (max 3–4 lines).
- skills → Deduplicate, normalize names, keep resume-friendly.
- experience → Action verbs, quantifiable impact, professional tone.
- education → Clean formatting, proper degree/school names.
- projects → Polish titles & descriptions, add technologies if available.
- achievements → Rewrite into strong bullet points.
- insights → Rewrite into concise impactful bullet points.
- certifications, awards, languages → Keep factual, consistent formatting.

⚠️ STRICT OUTPUT FORMAT: Return ONLY valid JSON matching this structure:

{
  "personalInfo": {
    "fullName": "Polished Full Name",
    "email": "user@example.com",
    "phone": "Formatted Phone",
    "location": "City, Country",
    "linkedIn": "https://linkedin.com/in/...",
    "github": "https://github.com/...",
    "portfolio": "https://..."
  },
  "summary": "Polished professional summary...",
  "skills": ["Skill 1", "Skill 2"],
  "experience": [...],
  "education": [...],
  "projects": [...],
  "achievements": [...],
  "insights": [...],
  "certifications": [...],
  "awards": [...],
  "languages": [...]
}
    `;

    // 🔹 Step 3: Call AI
    const polished = await generateResumeWithAI(resume.toObject(), instruction);

    // 🔹 Step 4: Update DB with polished resume
    const updatedResume = await Resume.findOneAndUpdate(
      { userId },
      { $set: { ...polished, "settings.lastUpdated": new Date() } },
      { new: true }
    );

    // 🔹 Step 5: Respond
    return res.json({
      success: true,
      message: "Resume polished successfully",
      resume: updatedResume,
    });

  } catch (error) {
    console.error("PolishResume Error:", error);
    res.status(500).json({ error: "Failed to polish resume" });
  }
};

export const getResume = async (req,res) =>{
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        // 🔹 Step 1: Get resume
        const resume = await Resume.findOne({ userId });
        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        // 🔹 Step 2: Respond with resume
        return res.json({
            success: true,
            resume
        });

    } catch (error) {
        console.error("GetResume Error:", error);
        res.status(500).json({ error: "Failed to get resume" });
    }
};

