const knex = require("../db/connection");

async function list(is_showing) {
  const is_showing_filter = is_showing ? "mt.is_showing" : true;

  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where(is_showing_filter, true)
    .select("m.*")
    .groupBy("m.movie_id");
}

async function readMovie(movieId) {
  return knex("movies").select("*").where("movie_id", movieId).first();
}

// THIS WORKS ****
//   const movies = await knex.select("*").from("movies as m");
//   if (is_showing_param) {
//     return knex("movies_theaters as mt")
//       .join("movies as m", "m.movie_id", "=", "mt.movie_id")
//       .where({ is_showing: true })
//       .select("m.*")
//       .groupBy("m.movie_id");
//   } else return movies;
// ***

module.exports = {
  list,
  readMovie,
};
