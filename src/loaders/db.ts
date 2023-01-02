import mongoose from "mongoose";
import { DataSource } from "typeorm";
import config from "../config";
import Movie from "../models/Movie";
import Review from "../models/Review";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);

    mongoose.set("autoCreate", true);

    console.log("Mongoose Connected ...");

    Movie.createCollection().then(function (collection) {
      console.log("Movie Collection is created!");
    });

    Review.createCollection().then(function (collection) {
      console.log("Review Collection is created!");
    });
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

const connectTypeORM = async () => {
  try {
    const myDataSource = new DataSource({
      type: "postgres",
      host: config.pgHost,
      port: 5432,
      username: config.pgUser,
      password: config.pgPassword,
      database: config.pgDatabase,
    });

    await myDataSource.initialize();
    console.log("PostgreSQL Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization", error);
  }
};

export { connectTypeORM, connectMongoDB };
