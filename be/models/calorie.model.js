import mongoose from "mongoose";

const CalorieSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    time: { type: Date, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true, strictQuery: true }
);

const Calorie = mongoose.model("Calorie", CalorieSchema);

export default Calorie;
