import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import calorieRoutes from "./routes/calorie.route.js";
import inviteRoutes from "./routes/invite.route.js";
import reportRoutes from "./routes/report.route.js";
import { decodeRequestToken } from "./middlewares/index.js";
import { connectDB } from "./utils/database.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
connectDB();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "app is running" });
});

app.use("/calories", decodeRequestToken, calorieRoutes);
app.use("/reports", decodeRequestToken, reportRoutes);
app.use("/invites", decodeRequestToken, inviteRoutes);

app.listen(PORT, () => {
  console.log(`App Listening on port ${PORT} `);
});
