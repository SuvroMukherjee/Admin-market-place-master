
import { CiStar } from "react-icons/ci"; 
import { FaStar } from "react-icons/fa";
import React from 'react';


export const StarRating = ({ value }) => {

    const style = {
        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
    }
    // Ensure the value is between 0 and 5
    const normalizedValue = Math.max(0, Math.min(5, Math.round(value)));

    // Create an array with the required number of solid stars
    const solidStars = Array.from({ length: normalizedValue }, (_, index) => (
        <FaStar key={index} size={25}  color='gold'  />
    ));

    // Create an array with the required number of regular stars
    const regularStars = Array.from({ length: 5 - normalizedValue }, (_, index) => (
        <CiStar key={index + normalizedValue} size={30} color='gold'  />
    ));

    return (
        <div className="rating-stars d-flex justify-content-evenly">
            {solidStars}
            {regularStars}
        </div>
    );
};
