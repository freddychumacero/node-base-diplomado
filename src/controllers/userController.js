import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/User.js";
import Task from "../models/Task.js";

// GET /api/users - Obtener lista de usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "status"],
    });

    return res.json({
      total: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/users - Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hashear el password con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id - Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["username", "status"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/users/:id - Actualizar usuario completo
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await User.update(
      { username, password: hashedPassword },
      { where: { id } }
    );

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/:id - Actualizar parcial (ej. status)
const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await User.update({ status }, { where: { id } });

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/users/:id - Eliminar usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.destroy({ where: { id } });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:id/tasks - Obtener usuario con sus tareas
const getUserWithTasks = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["username"],
      include: {
        model: Task,
        as: "tasks",
        attributes: ["name", "done"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/list/pagination - Paginación con búsqueda (30 pts)
const getUsersPagination = async (req, res) => {
  try {
    // Extraer query params con valores por defecto
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const orderBy = req.query.orderBy || "id";
    const orderDir = req.query.orderDir || "DESC";
    const status = req.query.status || "";

    // Calcular el offset para la paginación
    const offset = (page - 1) * limit;

    // Construir la condición WHERE dinámicamente
    const whereCondition = {};

    // Filtro por búsqueda (ILIKE = búsqueda sin importar mayúsculas/minúsculas)
    if (search) {
      whereCondition.username = { [Op.iLike]: `%${search}%` };
    }

    // Filtro por status
    if (status) {
      whereCondition.status = status;
    }

    // Consulta con paginación
    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      attributes: ["id", "username", "status"],
      order: [[orderBy, orderDir]],
      limit: limit,
      offset: offset,
    });

    // Calcular total de páginas
    const pages = Math.ceil(count / limit);

    return res.json({
      total: count,
      page: page,
      pages: pages,
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  patchUser,
  deleteUser,
  getUserWithTasks,
  getUsersPagination,
};
