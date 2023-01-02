const SnakeNamingStrategy =
  require("typeorm-naming-strategies").SnakeNamingStrategy;

module.exports = {
  type: "postgres",
  host: "hyositive-db.cxjkenja1vcl.ap-northeast-2.rds.amazonaws.com",
  port: 5432,
  username: "postgres",
  password: "12345678",
  database: "typeorm",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  namingStrategy: new SnakeNamingStrategy(),
};
