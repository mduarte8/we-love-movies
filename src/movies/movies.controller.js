const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await service.readMovie(movieId);
  if (foundMovie) {
    res.locals.movie = foundMovie;
    return next();
  }
  next({
    status: 404,
    message: "Movie cannot be found",
  });
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function list(req, res) {
  const { is_showing = false } = req.query;
  const data = await service.list(is_showing);
  res.json({
    data,
  });
}

async function readMovieTheaters(req, res) {
  const { movieId } = req.params;
  const data = await service.readMovieTheaters(movieId);
  res.json({ data });
}

async function readMovieReviews(req, res) {
  const { movieId } = req.params;
  const data = await service.readMovieReviews(movieId);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readMovieTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieTheaters),
  ],
  readMovieReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMovieReviews),
  ],
};
