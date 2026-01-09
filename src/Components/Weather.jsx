import React, { useEffect, useRef, useState } from "react";
import './weather.css';
import Livedatetime from './LiveDateTime';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faTint } from "@fortawesome/free-solid-svg-icons/faTint";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const Weather = () => {
    const[view, setView] = useState(false);
    const inputRef = useRef();
    function handleClick() {
        setView(true);
    }
    const allIcons = (iconCode) => {
        return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    }
    const [weatherData, setWeatherData] = useState(false);
    const search = async (city) => {
        if(city === '') {
            alert('Enter city name');
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url); // fetch/request Weather data for this city from API Server
            const data = await response.json(); // convert JSON text into JS object
            if(!response.ok) {
                alert(data.message);
                return;
            }
            console.log(data);
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp), //Math.floor get the integer val instead of decimal
                feelsLike: Math.floor(data.main.feels_like),
                location: data.name,
                icon: allIcons(data.weather[0].icon),
                description: data.weather[0].description
            })
        } catch (error) {
            setWeatherData(false);
            console.error('Error in fetching weather data');           
        }
    }
    useEffect(()=> {
        search('London');
    }, [])
    return (
        <div className="container">
            <div className="title">
                <h1>Weather Data app</h1>
            </div>
            {view ? <>
            <div className="searchBox">
                 <input ref={inputRef} type = 'text' placeholder="Enter city"></input>
                 <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" onClick={() => 
                {  
                    search(inputRef.current.value);
                    inputRef.current.value = "";
                }}/>               
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
            <div className="weather-icon">
               {weatherData.icon ? (
                <img src={weatherData.icon} className="weather-icon" />
                ) : (
                <FontAwesomeIcon icon={faSun} />
                )}
                <div className="weather-description">
                   <span>{weatherData.description}</span>
                </div>
            </div>
            <div className="temperature">
                <p className="degrees">{weatherData.temperature}°C</p>
                <span className="feels_like_temp"><i>feels_Like {weatherData.feelsLike} °C</i></span>
                <p className="location">{weatherData.location}</p>
            </div>
            <div className="weather-data">
                <div className="col">
                    <FontAwesomeIcon className="humidity-icon" icon = {faTint} />  
                    <div>  
                       <p>{weatherData.humidity} %</p>      
                       <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <FontAwesomeIcon className="wind-icon" icon = {faWind} />   
                    <div> 
                       <p>{weatherData.windSpeed} km/h</p>      
                       <span>Wind Speed</span>
                    </div>
                </div>
            </div>
            </> : <></>}
        </div>
    );
}
export default Weather