// models/Stat.js
import mongoose from "mongoose";

const workProcessSchema = new mongoose.Schema(
    {

        icon: {
            type: String,
            default: "💻",
        },

        ar_label: {
            type: String,
            required: true,
            trim: true,
        },
        en_label: {
            type: String,
            required: true,
            trim: true,
        },

        ar_description: {
            type: String,
            required: true,
            trim: true,
        },
        en_description: {
            type: String,
            required: true,
            trim: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        isVisible: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true }
);


workProcessSchema.index({order: 1 });

export default mongoose.model("WorkProcess", workProcessSchema);