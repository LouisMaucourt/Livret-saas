export const formatHour = (time: string) => {
    const [h, m] = time.split(":");
    return `${h}h${m}`;
};