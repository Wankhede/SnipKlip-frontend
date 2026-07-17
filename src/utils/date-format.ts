export default function formatDate(value: string, format: string){
    const date = new Date(value);
    if (isNaN(date.getTime())) {
        return '-'; // Handle invalid date strings
    }
    const options: Intl.DateTimeFormatOptions = {
        weekday: format.includes('EEE') ? 'short' : undefined,
        day: format.includes('dd') ? '2-digit' : undefined,
        month: format.includes('MMM') ? 'short' : undefined,
        year: format.includes('yyyy') ? 'numeric' : undefined,
        hour12: true,
        hour: format.includes('HH') ? '2-digit' : undefined,
        minute: format.includes('mm') ? '2-digit' : undefined,
        second: format.includes('ss') ? '2-digit' : undefined,
        timeZone: 'IST', // Specify the desired time zone here
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDateTime = formatter.format(date);
    return formattedDateTime;
}