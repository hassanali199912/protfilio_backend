import mongoose from "mongoose";

const skillsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
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

skillsSchema.index({ order: 1 });

export default mongoose.model("Skills", skillsSchema);
