import express from "express";
import { inviteFriend } from "../controllers/invite.controller.js";
import { checkForUser } from "../middlewares/index.js";

const router = express.Router();

router.post("/", checkForUser, inviteFriend);

export default router;
