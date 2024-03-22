import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';


export const StarRating = ({ value }) => {
    // Ensure the value is between 0 and 5
    const normalizedValue = Math.max(0, Math.min(5, Math.round(value)));

    // Create an array with the required number of solid stars
    const solidStars = Array.from({ length: normalizedValue }, (_, index) => (
        <FontAwesomeIcon key={index} icon={solidStar} className="StatIcon" />
    ));

    // Create an array with the required number of regular stars
    const regularStars = Array.from({ length: 5 - normalizedValue }, (_, index) => (
        <FontAwesomeIcon key={index + normalizedValue} icon={regularStar} className="StatIcon" />
    ));

    return (
        <div className="rating-stars">
            {solidStars}
            {regularStars}
        </div>
    );
};
