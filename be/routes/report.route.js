import express from "express";
import { getThisAndLastWeekReport } from "../controllers/report.controller.js";
import { checkForAdmin } from "../middlewares/index.js";

const router = express.Router();

router.get("/", checkForAdmin, getThisAndLastWeekReport);

export default router;
