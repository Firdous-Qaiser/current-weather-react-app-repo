import { useEffect, useState } from "react";
import './weather.css';

const Livedatetime = () => {
    const[now, setNow] = useState(new Date());
    
    useEffect(() => {
        setNow(new Date());
        const interval = setInterval(() => {
            setNow(new Date());
        }, 60000) // calls every 1 minute

        return () => clearInterval(interval);
    }, []);

    const formatter = new Intl.DateTimeFormat('en-GB' , { // its a built-in Javascript core concept  'intl: Internalization uses for langugaes, date, time, and currencies AND 
    // DateTimeFormat is its class have two elements 'en-GB' means langauge english(UK) 
    // and date order is 1 Jan instead of Jan 1 and second element is object define what 
    // part of date&time you want.
        weekday: 'long', // It would be like 'Monday' not short like 'Mon
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    }).format(now).replace('AM', 'am').replace('PM', 'pm');
    return (
        <div>{formatter}</div>
    );
}
export default Livedatetime