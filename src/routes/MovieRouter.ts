import { Router } from "express";
import MovieController from "../controllers/MovieController";
import { body } from "express-validator";
import auth from "../middlewares/auth";

const router: Router = Router();

router.post('/', [
    body('title').notEmpty(),
    body('director').notEmpty(),
], MovieController.createMovie);

router.post('/:movieId/comment', [
    body('writer').notEmpty(),
    body('comment').notEmpty()
], MovieController.createMovieComment);

router.get('/:movieId', MovieController.getMovie);
router.put('/:movieId/comments/:commentId', [
    body('comment').notEmpty()
], auth, MovieController.updateMovieComment);

router.get('/', MovieController.getMoviesBySearch);

export default router;