import mongoose from "mongoose"
import Journal from "../models/journal.model.js"

export const getUserAllJournals = async (userId) => {
    const journals = await Journal.find({ user: userId });
    return journals;
}

export const getOneJournalDocument = async (journalId) => {
    const journal = await Journal.findById(journalId);
    return journal;
}

export const createJournalDocument = async (data) => {
    const journal = new Journal({
        title: data.title,
        content: data.content,
        user: data.user,
        tags: data.tags,
        visibility: data.visibility,
        attachments: data.attachments
    });
    await journal.save();
    return journal;
}

export const updateJournalDocument = async (journalId,data) =>{
   const journal = await Journal.findByIdAndUpdate(journalId, {$set: data}, { new: true });
   return journal;
}

export const deleteJournalDocument = async (journalId) =>{
   const journal = await Journal.findOneAndDelete({ _id: journalId });
   return journal;
}

export const starJournalDocument = async (journalId) => {
  const journal = await Journal.findById(journalId);
  if (!journal) throw new Error("Journal not found");

  journal.isStarred = !journal.isStarred; // toggle
  await journal.save();

  return journal;
};
