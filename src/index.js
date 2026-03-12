import app from "./app.js";
import envs from "./config/index.js";
import logger from "./logs/logger.js";
import { connectDB } from "./database/connection.js";

// Importar modelos para que se registren las relaciones
import "./models/User.js";
import "./models/Task.js";

const main = async () => {
  // Iniciar el servidor primero (para que Render lo detecte como activo)
  app.listen(envs.PORT, () => {
    logger.info(`Server on port ${envs.PORT}`);
  });

  // Luego conectar a la base de datos
  try {
    await connectDB();
  } catch (error) {
    logger.error("Error en conexión inicial a la BD:", error.message);
  }
};

main();

