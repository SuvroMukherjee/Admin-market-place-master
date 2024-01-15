import { getUserLoginLocation, setAttendenceLogin } from "../../../API/api";

export const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
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


const getUserLocation = async (lat, long) => {
    let res = await getUserLoginLocation(lat, long);

    console.log(res);
    let payload = {
        "log_in_time": res?.data?.location?.localtime,
        "log_in_loc": {
            location : res?.data?.location?.name,
            city: res?.data?.location?.tz_id,
            state: res?.data?.location?.region,
        }
    }
    console.log(payload);

    setUserAttendence(payload)
}

const setUserAttendence = async (payload) => {
    let res = await setAttendenceLogin(payload);
    localStorage.setItem('keyManagerAttenceId',res?.data?.data?._id)
    console.log(res, 'resdata')
}