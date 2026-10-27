import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    whatsapp: {
        type: String,
        required: true,
        trim: true,
    },
    budget: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Message", messagesSchema);
