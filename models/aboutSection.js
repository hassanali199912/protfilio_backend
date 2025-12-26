import mongoose from "mongoose";


const aboutSchema = new mongoose.Schema({

    ar_title: {
        type: String,
        required: true
    },
    en_title: {
        type: String,
        required: true
    },
    ar_bio: {
        type: String,
        required: true
    },
    en_bio: {
        type: String,
        required: true
    },
    profile_photo: {
        type: String
    },
    cv_link: {
        type: String
    },
    isVisible: { type: Boolean, default: true }


}, { timestamps: true });

export default mongoose.model("AboutSection", aboutSchema);