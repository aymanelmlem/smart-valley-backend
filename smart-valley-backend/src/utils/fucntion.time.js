function calculateTotalTime(timesArray) {
    let totalSeconds = 0;

    timesArray.forEach(time => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        totalSeconds += (hours * 3600) + (minutes * 60) + seconds;
    });

    const totalHours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalSecondsLeft = totalSeconds % 60;

    return `${totalHours}h${totalMinutes}m${totalSecondsLeft}s`;
}
export default calculateTotalTime;