
export const ChangeFormatDate = (dateParams) => {
    //December 5, 2023, 11:00:37 AM
    const formattedDate = new Date(dateParams).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
    return formattedDate;
};


export const ChangeFormatDate2 = (dateParams) => {
    const formattedDate = new Date(dateParams).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    return formattedDate;
};

export function splitDateTime(inputDateTime) {
    // Create a new Date object from the input string
    const dateTimeObject = new Date(inputDateTime);
   
    if (dateTimeObject){
        // Extract date and time components
        const dateComponent = dateTimeObject?.toISOString()?.split('T')?.[0];

        // Extract time components and remove seconds
        const timeComponent = dateTimeObject?.toISOString()?.split('T')?.[1].split('.')?.[0];

        return {
            date: dateComponent,
            time: timeComponent,
        };
    }else{
        return;
    }
}



export function calculateTimeDifference(dateTime1, dateTime2) {
    const date1 = new Date(dateTime1);
    const date2 = new Date(dateTime2);

    // Calculate the difference in milliseconds
    const timeDifference = Math.abs(date1 - date2);

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}


export function getDayOfWeek(dateString) {
    const dateObject = new Date(dateString);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObject.getUTCDay()];

    return dayOfWeek;
}