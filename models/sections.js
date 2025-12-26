import mongoose from "mongoose"

const SectionSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true,
        // hero, about, work_process, portfolio, blog, contact, etc
    },
    title: String,
    isVisible: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });



export default mongoose.model("Sections", SectionSchema)