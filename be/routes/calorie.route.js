import express from "express";
import { getCalories, addCalorie, updateCalorie, deleteCalorie } from "../controllers/calorie.controller.js";
import { checkForAdmin } from "../middlewares/index.js";

const router = express.Router();

router.get("/", getCalories);
router.post("/", addCalorie);
router.patch("/:id", checkForAdmin, updateCalorie);
router.delete("/:id", checkForAdmin, deleteCalorie);

export default router;
