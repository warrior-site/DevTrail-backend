import mongoose from "mongoose"

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    repoLink: {
        type: String,
        required: true
    },
    liveLink: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    significance:{
        type: String,
        required: true
    },
    techStack:[
        {
            type:String,
            required:true
        }
    ]
})

const Project = mongoose.model("Project",projectSchema)
export default Project;