import mongoose from "mongoose";

const globalSettingSchema = new mongoose.Schema({
    contact: {
        email: String,
        phone: String,
        address: String
    },
    cvLink: String,
    personalImage: String,
}, {
    timestamps: true
});


export default mongoose.model("GLobal",globalSettingSchema)