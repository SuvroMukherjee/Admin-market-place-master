export const ratingCalculation = (id, reviewData) => {
    let filterReview = reviewData?.filter((item) => (
        item?.proId?._id == id
    ));
    // console.log({ filterReview });

    if (!filterReview || filterReview.length === 0) {
        return 0;
    }
    const sumOfRatings = filterReview.reduce((total, review) => {
        return total + parseInt(review.rating);
    }, 0);

    const averageRating = sumOfRatings / filterReview.length;
    return averageRating;
};