import app from "./app.js";
import envs from "./config/index.js";
import logger from "./logs/logger.js";
import { connectDB } from "./database/connection.js";

// Importar modelos para que se registren las relaciones
import "./models/User.js";
import "./models/Task.js";

const main = async () => {
  // Conectar a la base de datos
  await connectDB();

  // Iniciar el servidor
  app.listen(envs.PORT, () => {
    logger.info(`Server on port ${envs.PORT}`);
  });
};

main();
