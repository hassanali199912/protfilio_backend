// models/Stat.js
import mongoose from "mongoose";

const statSchema = new mongoose.Schema(
    {
        value: {
            type: String,
            required: true,
            trim: true,
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

        order: {
            type: Number,
            default: 0,
        },

        isVisible: {
            type: Boolean,
            default: true,
        },

        bgColor: {
            type: String,
            default: "#6C63FF",
        },
        icon: {
            type: String,
            default: "💻",
        },
    },
    { timestamps: true }
);


statSchema.index({  order: 1 });

export default mongoose.model("Stat", statSchema);