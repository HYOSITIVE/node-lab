import config from ".";
import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "postgres",
  host: config.pgHost,
  port: 5432,
  username: config.pgUser,
  password: config.pgPassword,
  database: config.pgDatabase,
  synchronize: true,
  entities: [__dirname + "/../entity/*.{js,ts}"],
});
