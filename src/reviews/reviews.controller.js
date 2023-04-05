const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await service.readReview(reviewId);
  if (foundReview) {
    res.locals.review = foundReview;
    return next();
  }
  next({
    status: 404,
    message: "Review cannot be found",
  });
}

async function update(req, res) {
  const { reviewId } = req.params;
  const update = await service.updateReview(reviewId, req.body.data);
  const data = update[0];
  res.json({ data });
}

module.exports = {
  update: [
    asyncErrorBoundary(reviewExists),
    hasProperties("content"),
    asyncErrorBoundary(update),
  ],
};
