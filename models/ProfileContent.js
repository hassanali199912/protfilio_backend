import mongoose from "mongoose";

const profileContentSchema = new mongoose.Schema({
  hero: {
    title: {
      ar: String,
      en: String
    },
    description: {
      ar: String,
      en: String
    },
  },

  about: {
    title: {
      ar: String,
      en: String
    },
    description: {
      ar: String,
      en: String
    },


  },
  work_process: {
    title: {
      ar: String,
      en: String
    },
    description: {
      ar: String,
      en: String
    },
  },
  portfolio: {
    title: {
      ar: String,
      en: String
    },
    description: {
      ar: String,
      en: String
    },
  },
  what_i_do: {
    title: {
      ar: String,
      en: String
    },
    description: {
      ar: String,
      en: String
    },
  },

}, { timestamps: true });

export default mongoose.model("ProfileContent", profileContentSchema);
