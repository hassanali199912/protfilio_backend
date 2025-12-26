import mongoose from "mongoose";


const portfolioSchema = new mongoose.Schema({
    images: [{
        type: String
    }],
    videos: [{
        type: String
    }],
    tags: [{
        type: String
    }],
    main_image: {
        type: String
    },
    ar_name: {
        type: String,
        required: true
    },
    en_name: {
        type: String,
        required: true
    },
    ar_description: {
        type: String,
        required: true
    },
    en_description: {
        type: String,
        required: true
    },
    ar_cat_name: {
        type: String,
        required: true
    },
    en_cat_name: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0,
    },
    isVisible: {
        type: Boolean,
        default: true,
    },


}, { timestamps: true })

portfolioSchema.index({ order: 1 })

export default mongoose.model("Portfolio", portfolioSchema)