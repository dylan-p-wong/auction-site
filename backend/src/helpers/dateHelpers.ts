export const toUnixTimestamp = (d : Date) => {
    return (d.getTime() / 1000).toFixed(0);
}

export const timeLeftMS = (a : Date, b: Date) => {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
    return Math.floor((utc2 - utc1));
}