const knex = require("../db/connection");
// const mapProperties = require("../utils/map-properties");
const addCritic = require("../utils/addCritic");

async function list(is_showing) {
  const is_showing_filter = is_showing ? "mt.is_showing" : true;

  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where(is_showing_filter, true)
    .select("m.*")
    .groupBy("m.movie_id");
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

async function readMovie(movieId) {
  return knex("movies").select("*").where("movie_id", movieId).first();
}
async function readMovieTheaters(movieId) {
  return knex("theaters as t")
    .join("movies_theaters as mt", "mt.theater_id", "=", "t.theater_id")
    .where({ movie_id: movieId, is_showing: true })
    .select("*");
}

// const addCritic = mapProperties({
//   critic_id: "critic.critic_id",
//   preferred_name: "critic.preferred_name",
//   surname: "critic.surname",
//   organization_name: "critic.organization_name",
//   created_at: "critic.created_at",
//   updated_at: "critic.updated_at",
// });

async function readMovieReviews(movieId) {
  return knex("reviews as r")
    .join("movies as m", "m.movie_id", "=", "r.movie_id")
    .join("critics as c", "r.critic_id", "=", "c.critic_id")
    .where("r.movie_id", movieId)
    .select("*")
    .then((results) => results.map((result) => addCritic(result)));
  // NEED TO MAP OVER ALL RESULTS FROM QUERY WHICH IS ARRAY AND ADDCRITIC
}

module.exports = {
  list,
  readMovie,
  readMovieTheaters,
  readMovieReviews,
  addCritic,
};
