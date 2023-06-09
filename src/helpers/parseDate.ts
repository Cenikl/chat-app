export const parseDate = (messageDate:string) => {
    const date = new Date(messageDate);
    return date.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '')
}