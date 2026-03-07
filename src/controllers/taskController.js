import Task from "../models/Task.js";

// GET /api/tasks - Obtener tareas del usuario autenticado
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    const tasks = await Task.findAll({
      where: { userId },
      attributes: ["id", "name", "done"],
    });

    return res.json({
      total: tasks.length,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/tasks - Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const task = await Task.create({ name, userId });

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/tasks/:id - Obtener tarea por ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      attributes: ["name", "done"],
    });

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id - Actualizar tarea completa
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await Task.update({ name }, { where: { id } });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/tasks/:id - Actualizar parcial (done)
const patchTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    const result = await Task.update({ done }, { where: { id } });

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id - Eliminar tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await Task.destroy({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
};
