// models/Template.model.js
import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
    folderName: { type: String, required: true },
    name: String,
    description: String,
});

export const Template = mongoose.model("Template", templateSchema);
