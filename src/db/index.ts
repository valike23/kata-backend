import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false, // Set to true if you want SQL logs in console
});

export default sequelize;
