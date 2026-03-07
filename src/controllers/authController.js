import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import envs from "../config/index.js";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Comparar password con el hash
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      envs.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default { login };
