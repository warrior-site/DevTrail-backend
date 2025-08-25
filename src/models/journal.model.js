import mongoose from "mongoose"

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    required: true
  }],
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "private"
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
