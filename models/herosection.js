import mongoose from "mongoose";

const heroSectionSchema = new mongoose.Schema({

    ar_name: {
        type: String,
        require: true,
    },
    en_name: {
        type: String,
        require: true,
    },
    ar_title: {
        type: String,
        require: true,
    },
    en_title: {
        type: String,
        require: true,
    },
    ar_description: {
        type: String,
        require: true,
    },
    en_description: {
        type: String,
        require: true,
    },
    profile_photo: {
        type: String
    },
    button_link: {
        type: String,
        default: "mailto:hassanalihassan1203@gmail.com"
    },
    isVisible: { type: Boolean, default: true }

}, {
    timestamps: true
})


export default mongoose.model("Hero", heroSectionSchema);