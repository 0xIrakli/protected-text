import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    title: String,
    note: String,
    password: String,
  },
  {
    timestamps: true,
    // versionKey: false
  }
)

export const NOTE = mongoose.model("NOTE", noteSchema)