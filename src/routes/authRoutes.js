import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

// POST /api/login
router.post("/", authController.login);

export default router;
