import mongoose from "mongoose";


const portfolioSchema = new mongoose.Schema({

    title: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },

    shortDescription: {
        ar: { type: String, required: true },
        en: { type: String, required: true }
    },

    image: {
        type: String,
        required: true
    },

    role: {
        ar: String,
        en: String
    },

    techStack: [
        {
            type: String
        }
    ],

    projectType: {
        type: String,
        enum: ["personal", "freelance", "government", "company"],
        required: true
    },

    liveUrl: String,
    githubUrl: String,

    isFeatured: {
        type: Boolean,
        default: false
    },

    order: {
        type: Number,
        default: 0
    },

    isVisible: {
        type: Boolean,
        default: true
    }



}, { timestamps: true })

portfolioSchema.index({ order: 1 })

export default mongoose.model("Portfolio", portfolioSchema)