import { useCurrentTime } from '../../hooks/useCurrentTime';


export const CurrentTime = () => {
    const currentTime = useCurrentTime();

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const day = days[date.getUTCDay()];
        const dayNumber = date.getUTCDate();
        const month = months[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        return `${day}, ${dayNumber} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
    };


    return (
        <div>
            <h2>Current Time:</h2>
            <p>{formatDate(currentTime)}</p>
        </div>
    );
};


