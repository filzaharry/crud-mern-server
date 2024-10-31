import mongoose from "mongoose";

const LoginDurationSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export const LoginDurationModel = mongoose.model("LoginDuration", LoginDurationSchema);
export const createLoginDuration = (values: Record<string, any>) => new LoginDurationModel(values).save().then((user) => user.toObject());
