import React, { useEffect, useRef, useState } from "react";
import './weather.css';
import Livedatetime from "./LiveDateTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Weather = () => {
    const[view, setView] = useState(false);
    const [weatherData, setWeatherData] = useState(false);
    const [forecast, setForecast] = useState([]);
    const inputRef = useRef();
    function handleClick() {
        setView(true);
    }
    const getIconUrl = (iconCode) => 
        `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    const search = async (city) => {
        if(city === '') {
            alert('Enter city name');
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_WEATHER_APP_ID}`;
            const response = await fetch(url); // fetch/request Weather data for this city from API Server
            const data = await response.json(); // convert JSON text into JS object
            if(!response.ok) {
                alert(data.message);
                return;
            }
            console.log(data);
            const current = data.list[0]; 
        setWeatherData({
            humidity: current.main.humidity,
            windSpeed: current.wind.speed,
            temperature: Math.floor(current.main.temp),
            location: data.city.name,
        });
        setForecast(data.list.slice(0, 8));
        } catch (error) {
            setWeatherData(false);
            console.error('Error in fetching weather data');           
        }
    }
    function handleSearch() {
        const value = inputRef.current.value;
        if(!value.trim()) {
            search(value);
            return;
        }
        search(value);
        inputRef.current.value = "";
        inputRef.current.focus();
    }
    useEffect(()=> {
        search('London');
    }, [])
    useEffect(() => {
        if (view) {
           inputRef.current?.focus();
        }
    }, [view]);
    return (
        <div className="container">
            <div className="title">
                <h1>Weather Data app</h1>
            </div>
            {view ? <>
            <div className="searchBox">
                 <input ref={inputRef} type = 'text' placeholder="Enter city" onKeyDown={(e) => {
                    if(e.key === 'Enter') handleSearch() }}></input>
                 <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" onClick={() => handleSearch()}/>               
            </div></> : <>
            <div className="Location_nav">
                <div className="Location_nav_title">
                  <FontAwesomeIcon className="Location_nav_icon" icon = { faLocationDot } />
                  <p className="Location_nav_text">Location</p>
               </div>
               <div className="Location_nav_action">
                  <FontAwesomeIcon className="Location_nav_addBtn" icon = { faPlus } onClick={() => handleClick()}/>
               </div>
            </div>
            </>}
            {weatherData ? <>
            <div className='currentDateTime'>
               <Livedatetime /> 
            </div>
            <div className="temperature">
                <p className="degrees">{weatherData.temperature}°C</p>
                <p className="location">{weatherData.location}</p>
                <p><span><i>Humidity: {weatherData.humidity} %</i></span></p>
                <p><span><i>windSpeed: {weatherData.windSpeed} km/h</i></span></p>
            </div>
            <div className="forecast">
                {forecast.map((item, index) => (
                    <div className="forecast-item" key={index}>
                        <p className="forecast-date">
                            {(() => {
                                const date = new Date(item.dt * 1000); 
                                const day = date.getDate();
                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                const getOrdinal = (d) => {
                                    if (d > 3 && d < 21) return 'th';
                                    switch (d % 10) {
                                        case 1: return 'st';
                                        case 2: return 'nd';
                                        case 3: return 'rd';
                                        default: return 'th';
                                    }};
                                    return `${day}${getOrdinal(day)} ${month}`;
                                    })()}
                                    </p>
                                    <p className="forecast-day">
                                        {new Date(item.dt * 1000).toLocaleString([], {
                                            weekday: 'long'
                                        })}
                                    </p>
                                    <p className="forecast-time">
                                        {new Date(item.dt * 1000).toLocaleString([], {
                                            hour: 'numeric',
                                            hour12: true,
                                        })}
                                    </p>
                                    <img
                                    src = {getIconUrl(item.weather[0].icon)}>
                                    </img>
                                    <p className="forecast-temp">
                                        {Math.floor(item.main.temp)}°C
                                    </p>
                                </div>
                            ))}
                        </div>
            </> : <></>}
        </div>
    );
}
export default Weather
