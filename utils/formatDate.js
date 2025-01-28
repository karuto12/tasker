function nowFormated(date) {
    // Get the formatted time and date
    const time = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    });

    const dateFormatted = date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    });

    // Combine the time and date in desired format
    const formattedDateTime = `${time} ${dateFormatted}`;

    return formattedDateTime;
}

module.exports = nowFormated;