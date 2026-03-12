import { Sequelize } from "sequelize";
import envs from "../config/index.js";
import logger from "../logs/logger.js";

const sequelize = new Sequelize(envs.DB_NAME, envs.DB_USER, envs.DB_PASSWORD, {
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 30000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      logger.info("Conexión a la base de datos establecida correctamente");
      await sequelize.sync({ alter: true });
      logger.info("Modelos sincronizados con la base de datos");
      return; // Conexión exitosa, salir
    } catch (error) {
      logger.error(
        `Intento ${i + 1}/${retries} - Error al conectar con la BD: ${error.message}`
      );
      if (i < retries - 1) {
        logger.info("Reintentando en 5 segundos...");
        await sleep(5000);
      }
    }
  }
  logger.error("No se pudo conectar a la BD después de todos los intentos");
};

export default sequelize;

