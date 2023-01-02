import express, { Request, Response, NextFunction } from "express";
const app = express();
import "reflect-metadata";
import { connectTypeORM } from "./loaders/db";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
require("dotenv").config();

// connectMongoDB();
connectTypeORM();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/src/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const swaggerSpec = YAML.load(path.join(__dirname, "./config/swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(routes); //라우터
// error handler

interface ErrorType {
  message: string;
  status: number;
}

app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
});

export default app;
