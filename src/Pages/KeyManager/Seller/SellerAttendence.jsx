import React, { useState } from 'react';
import { getUserLoginLocation } from '../../../API/api';

const SellerAttendence = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    getUserLocation(latitude, longitude);
                },
                (error) => {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setError("User denied the request for Geolocation.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setError("Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            setError("The request to get user location timed out.");
                            break;
                        case error.UNKNOWN_ERROR:
                            setError("An unknown error occurred.");
                            break;
                        default:
                            setError("An error occurred while getting the location.");
                    }
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };


    const getUserLocation = async(lat,long) => {
        let res =  await getUserLoginLocation(lat,long);

        console.log(res);

    }

    return (
        <div>
            <h1>Get Location</h1>
            <button onClick={getLocation}>Get My Location</button>

            {location && (
                <div>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}

            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default SellerAttendence;
