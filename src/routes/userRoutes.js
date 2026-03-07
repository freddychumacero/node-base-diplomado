import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// IMPORTANTE: las rutas más específicas van ANTES que las rutas con parámetros
// Si no, Express interpreta "list" como un :id

// GET /api/users/list/pagination - Paginación (30 pts - investigar)
router.get("/list/pagination", userController.getUsersPagination);

// GET /api/users - Listar todos los usuarios
router.get("/", userController.getUsers);

// POST /api/users - Crear usuario
router.post("/", userController.createUser);

// GET /api/users/:id - Obtener usuario por ID (requiere token)
router.get("/:id", authMiddleware, userController.getUserById);

// PUT /api/users/:id - Actualizar usuario completo (requiere token)
router.put("/:id", authMiddleware, userController.updateUser);

// PATCH /api/users/:id - Actualizar parcial (requiere token)
router.patch("/:id", authMiddleware, userController.patchUser);

// DELETE /api/users/:id - Eliminar usuario (requiere token)
router.delete("/:id", authMiddleware, userController.deleteUser);

// GET /api/users/:id/tasks - Obtener usuario con sus tareas
router.get("/:id/tasks", userController.getUserWithTasks);

export default router;
