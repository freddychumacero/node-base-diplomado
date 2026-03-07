import { Router } from "express";
import taskController from "../controllers/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Todas las rutas de tareas requieren autenticación
router.use(authMiddleware);

// GET /api/tasks - Listar tareas del usuario autenticado
router.get("/", taskController.getTasks);

// POST /api/tasks - Crear tarea
router.post("/", taskController.createTask);

// GET /api/tasks/:id - Obtener tarea por ID
router.get("/:id", taskController.getTaskById);

// PUT /api/tasks/:id - Actualizar tarea completa
router.put("/:id", taskController.updateTask);

// PATCH /api/tasks/:id - Actualizar parcial (done)
router.patch("/:id", taskController.patchTask);

// DELETE /api/tasks/:id - Eliminar tarea
router.delete("/:id", taskController.deleteTask);

export default router;
