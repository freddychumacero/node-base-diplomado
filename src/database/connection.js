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
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Conexión a la base de datos establecida correctamente");
    await sequelize.sync({ alter: true });
    logger.info("Modelos sincronizados con la base de datos");
  } catch (error) {
    logger.error("Error al conectar con la base de datos:", error.message);
    throw error;
  }
};

export default sequelize;
