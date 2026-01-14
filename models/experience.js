import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["education", "work"],
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    title: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },

    shortDescription: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
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
  { timeseries: true }
);

experienceSchema.index({ order: 1 });

export default mongoose.model("Experiences", experienceSchema);
