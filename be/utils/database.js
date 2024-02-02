import mongoose from "mongoose";

mongoose.set('strictQuery', true);

export const connectDB = async () => {
  const url = `mongodb://localhost:27017/calorie`;
  try {
    const connection = await mongoose.connect(url, {
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (e) {
    console.log("Failed to connect database:", e);
  }
};
