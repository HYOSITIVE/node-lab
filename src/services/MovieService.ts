import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { MovieCreateDto } from "../interfaces/movie/MovieCreateDto";
import { MovieCommentCreateDto } from "../interfaces/movie/MovieCommentCreateDto";
import Movie from "../models/Movie";
import { MovieInfo } from "../interfaces/movie/MovieInfo";
import { MovieCommentInfo } from "../interfaces/movie/MovieInfo";
import { MovieResponseDto } from "../interfaces/movie/MovieResponseDto";
import { MovieCommentUpdateDto } from "../interfaces/movie/MovieCommentUpdateDto";
import { MovieOptionType } from "../interfaces/movie/MovieOptionType";
import { MoviesResponseDto } from "../interfaces/movie/MoviesResponseDto";

const createMovie = async (
  movieCreateDto: MovieCreateDto
): Promise<PostBaseResponseDto> => {
  try {
    const movie = new Movie(movieCreateDto);

    await movie.save();

    const data = {
      _id: movie._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createMovieComment = async (
  movieId: string,
  movieCommentCreateDto: MovieCommentCreateDto
): Promise<MovieInfo | null> => {
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const newComments: MovieCommentInfo[] = [
      ...movie.comments,
      movieCommentCreateDto,
    ];

    const updatedMovie = await Movie.findOneAndUpdate(
      { _id: movieId },
      { comments: newComments },
      { new: true }
    );
    if (!updatedMovie) return null;

    return updatedMovie;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMovie = async (movieId: string): Promise<MovieResponseDto | null> => {
  try {
    const movie = await Movie.findById(movieId).populate(
      "comments.writer",
      "name"
    );
    if (!movie) return null;

    return movie;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateMovieComment = async (
  movieId: string,
  commentId: string,
  userId: String,
  commentUpdateDto: MovieCommentUpdateDto
): Promise<MovieInfo | null> => {
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) return null;

    const data = await Movie.findOneAndUpdate(
      {
        _id: movieId,
        comments: { selemMatch: { _id: commentId, writer: userId } },
      },
      {
        $set: {
          "comments.$.writer": userId,
          "comments.$.comment": commentUpdateDto.comment,
        },
      },
      { new: true }
    );
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getMoviesBySearch = async (
  search: string,
  option: MovieOptionType,
  page: number
): Promise<MoviesResponseDto> => {
  const regex = (pattern: string) => new RegExp(`.*${pattern}.*`);

  let movies: MovieInfo[] = [];
  const perPage: number = 2;

  try {
    const titleRegex = regex(search);

    if (option === "title") {
      movies = await Movie.find({ title: { $regex: titleRegex } })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    } else if (option === "director") {
      movies = await Movie.find({ director: { $regex: titleRegex } })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    } else {
      movies = await Movie.find({
        $or: [
          { title: { $regex: titleRegex } },
          { director: { $regex: titleRegex } },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);
    }

    const total: number = await Movie.countDocuments({});
    const lastPage: number = Math.ceil(total / perPage);

    return {
      lastPage,
      movies,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createMovie,
  createMovieComment,
  getMovie,
  updateMovieComment,
  getMoviesBySearch,
};
