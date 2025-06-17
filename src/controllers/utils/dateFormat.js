const formatTrip = (trip) => {
    const dateObj = new Date(trip.departureTime)
    const dayMonth = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }); // "DD/MM"
    const time = dateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }); // "HH:MM"
    
    return {
        ...trip.toObject(),
        dayMonth,
        time,
    };
};
module.exports = formatTrip;