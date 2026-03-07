import express from "express";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("combined"));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/login", authRoutes);

export default app;
