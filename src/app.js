import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Cargar documentación Swagger
const swaggerDocument = YAML.load(join(__dirname, "../swagger.yaml"));

// Middlewares
app.use(express.json());
app.use(morgan("combined"));

// Documentación Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz
app.get("/", (req, res) => {
    res.json({
        message: "API del Diplomado Full Stack - Freddy Chumacero",
        docs: "/api-docs",
        endpoints: {
            users: "/api/users",
            tasks: "/api/tasks",
            login: "/api/login",
        },
    });
});

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/login", authRoutes);

export default app;
