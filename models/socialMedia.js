import mongoose from "mongoose";


const socialMediaSchema = new mongoose.Schema({
    name: String,
    url: String,
    iconKey: String,
    isVisible: {
        type: Boolean,
        default: true
    },
    order: Number


}, { timestamps: true });

export default mongoose.model("SocialMedia", socialMediaSchema);