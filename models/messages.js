import mongoose from "mongoose";


const messagesSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    budget: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String
    },
    isRead: { type: Boolean, default: true }


}, { timestamps: true });

export default mongoose.model("Message", messagesSchema);