export const ratingCalculation = (id, reviewData) => {
  let filterReview = reviewData?.filter((item) => item?.proId?._id == id);

  if (!filterReview || filterReview.length === 0) {
    return 0;
  }
  const sumOfRatings = filterReview.reduce((total, review) => {
    return total + parseInt(review.rating);
  }, 0);

  const averageRating = sumOfRatings / filterReview.length;
  return averageRating;
};

export function addOrdinalSuffix(number) {
  if (typeof number !== "number") {
    return "Input is not a number";
  }

  if (number === 11 || number === 12 || number === 13) {
    return number + "th";
  }

  var lastDigit = number % 10;
  var suffix = "th";

  switch (lastDigit) {
    case 1:
      suffix = "st";
      break;
    case 2:
      suffix = "nd";
      break;
    case 3:
      suffix = "rd";
      break;
  }

  return number + suffix;
}
