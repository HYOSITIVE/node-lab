//router index file
import { Router } from 'express';
import UserRouter from "./UserRouter";
import ReviewRouter from "./ReviewRouter";
import MovieRouter from "./MovieRouter";
import FileRouter from "./FileRouter";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from 'path';

const router: Router = Router();

const swaggerSpec = YAML.load(path.join(__dirname, '../../build/swagger.yaml'))

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use('/user', UserRouter);
router.use('/review', ReviewRouter);
router.use('/movie', MovieRouter);
router.use('/file', FileRouter);

export default router;