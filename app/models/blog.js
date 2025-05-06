
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Blog", blogSchema);
