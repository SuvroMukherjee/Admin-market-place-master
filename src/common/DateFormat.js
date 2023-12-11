
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