import { createJournalDocument, deleteJournalDocument,
     getOneJournalDocument, getUserAllJournals,
      updateJournalDocument,starJournalDocument } 
from "../dao/journal.doa.js";
import User from "../models/user.model.js";

export const getAllJournal = async (req, res) => { 
    const { userId } = req.params;
    try {
        const journals = await getUserAllJournals(userId);
        res.status(200).json({
            success: true,
            message:"All Journal Fetched",
            data: journals
        });
    } catch (error) {
        console.log("error while fetching all journals", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const createJournal = async (req, res) => {
  const { userId, title, content, tags, visibility, attachments } = req.body;

  try {
    if (!userId || !title || !content || !tags || !visibility) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const journal = await createJournalDocument({
      user: userId,
      title,
      content,
      tags,
      visibility,
      attachments,
    });

    const today = new Date(new Date().setHours(0, 0, 0, 0));

    await User.findOneAndUpdate(
      { _id: userId, "journalDates.date": today },
      { $inc: { "journalDates.$.count": 1, journalCount: 1 } },
      { new: true }
    ) || await User.findByIdAndUpdate(
      userId,
      { $inc: { journalCount: 1 }, $push: { journalDates: { date: today, count: 1 } } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message:"Journal created successfully",
      data: journal,
    });
  } catch (error) {
    console.error("error while creating journal", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateJournal = async (req, res) => {
    const { journalId, userId, title, content, tags, visibility } = req.body;
    try {
        if (!journalId) {
            return res.status(400).json({ message: "journalId is required" });
        }
        const data = {
            ...(userId && { user: userId }),
            ...(title && { title }),
            ...(content && { content }),
            ...(tags && { tags }),
            ...(visibility && { visibility })
        }
        const journal = await updateJournalDocument(journalId, data);
        res.status(200).json({success:true , message: "journal updated", journal })
    } catch (error) {
        console.log("error while updating journal", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const deleteJournal = async (req, res) => {
    const { journalId } = req.body;
    try {
        if (!journalId) {
            return res.status(400).json({
                success: false,
                message: "journalId is required"
            });
        }
        const journal = await deleteJournalDocument(journalId);
        res.status(200).json({ message: "journal deleted", journal })
    } catch (error) {
        console.log("error while deleting journal", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getOneJournal = async (req, res) => {
    const { journalId } = req.params;
    try {
        const journal = await getOneJournalDocument(journalId);
        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }
        res.status(200).json({
            success: true,
            data: journal
        });
    } catch (error) {
        console.log("error while fetching journal", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const starTheJournal = async (req,res) =>{
   const { journalId } = req.body;
   try {
       if (!journalId) {
           return res.status(400).json({
               success: false,
               message: "journalId is required"
           });
       }
       const journal = await starJournalDocument(journalId);
       res.status(200).json({success:true , message: "journal starred", journal })
   } catch (error) {
       console.log("error while starring journal", error)
       res.status(500).json({
           success: false,
           message: "Internal Server Error",
           error: error.message
       });
   }
}