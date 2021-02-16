export const timeLeftMS = (a : Date, b: Date) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
    return Math.floor((utc2 - utc1));
}

export const formatTimeLeft = (mseconds : number) => {
    const seconds = mseconds / 1000;

    const hoursLeft = Math.floor(seconds / 3600);
    const minutesLeft = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor((seconds % 60));

    const minuteString = minutesLeft >= 10 ? minutesLeft : "0" + minutesLeft;
    const secondsString = secondsLeft >= 10 ? secondsLeft : "0" + secondsLeft;

    return `${hoursLeft}:${minuteString}:${secondsString}`;
}

export const formatTimeThumbnail = (mseconds: number) => {
    const seconds = mseconds / 1000;

    const days = Math.floor(seconds / (3600 * 24));
    const hoursLeft = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutesLeft = Math.floor((seconds % 3600) / 60);

    return `${days}d ${hoursLeft}h ${minutesLeft}m`;
}