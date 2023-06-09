const knex = require("../db/connection");
// const addCritic = require("../utils/addCritic");
const mapProperties = require("../utils/map-properties");

async function readReview(reviewId) {
  return knex("reviews").select("*").where("review_id", reviewId).first();
}

const addCriticReviewConfig = mapProperties({
  //   critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  c_created_at: "critic.created_at",
  c_updated_at: "critic.updated_at",
});

async function updateReview(reviewId, body) {
  const { score, content } = body;
  const update = await knex("reviews")
    .where({ review_id: reviewId })
    .update({ score, content, updated_at: knex.fn.now() });
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "=", "c.critic_id")
    .where("r.review_id", reviewId)
    .select(
      "r.*",
      "c.*",
      "c.created_at as c_created_at",
      "c.updated_at as c_updated_at",
      "r.updated_at as updated_at",
      "r.created_at as created_at"
    )
    .then((results) => results.map((result) => addCriticReviewConfig(result)));
}

async function destroyReview(reviewId) {
  await knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  readReview,
  updateReview,
  destroyReview,
};
