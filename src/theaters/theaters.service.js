const knex = require("../db/connection");

const reduceProperties = require("../utils/reduce-properties");

// movie_id: ["movies", null, "movie_id"],
//   title: ["movies", null, "title"],
//   rating: ["movies", null, "rating"],

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  is_showing: ["movies", null, "is_showing"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  m_created_at: ["movies", null, "created_at"],
  m_updated_at: ["movies", null, "updated_at"],
});

async function listTheaters() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "=", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "=", "m.movie_id")
    .select(
      "*",
      "m.created_at as m_created_at",
      "m.updated_at as m_updated_at",
      "t.created_at as created_at",
      "t.updated_at as updated_at"
    )
    .then(reduceMovies);
}

module.exports = { listTheaters };
