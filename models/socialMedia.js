import mongoose from "mongoose";


const socialMediaSchema = new mongoose.Schema({

    icon: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    isVisible: { type: Boolean, default: true }


}, { timestamps: true });

export default mongoose.model("SocialMedia", socialMediaSchema);