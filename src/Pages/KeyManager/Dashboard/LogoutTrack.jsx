import { attendenceList, getUserLoginLocation, setAttendenceLogin, setAttendenceLogout } from "../../../API/api";

const getLocationForLogout = async () => {
    try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const locationResponse = await getUserLocation(latitude, longitude);
        const payload = {
            "log_out_time": locationResponse?.data?.location?.localtime,
            "log_out_loc": {
                location: locationResponse?.data?.location?.name,
                city: locationResponse?.data?.location?.tz_id,
                state: locationResponse?.data?.location?.region,
            }
        };
        const userId = JSON.parse(localStorage.getItem('auth'))?.userId;
        const attendenceResponse = await getAttendenceList(userId);
        const attendenceId = attendenceResponse?.data?.data[0]?._id;
        const logoutResponse = await setAttendenceLogout(payload, attendenceId);
        console.log(logoutResponse, 'logout response');

       
        return logoutResponse?.data;
    } catch (error) {
        console.error("Error during logout:", error);
        return null;
    }
};

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
};

const getUserLocation = async (lat, long) => {
    const response = await getUserLoginLocation(lat, long);
    console.log(response);
    return response;
};

const getAttendenceList = async (userId) => {
    const response = await attendenceList(userId);
    console.log(response, 'getAttendenceList');
    return response;
};

export { getLocationForLogout };
