import React, { useEffect, useState } from 'react';
import './css/weather.css';
import { IoSunnyOutline } from 'react-icons/io5';
import { IoSearchCircleSharp } from 'react-icons/io5';

const Weather = () => {
  const [city, setCity] = useState(null);
  const [search, setSearch] = useState('Delhi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        const apiKey = '875868833176e03013faae95865a748c';
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=${apiKey}`;
        const response = await fetch(url);
        const resJson = await response.json();

        if (response.ok) {
          setCity(resJson);
          setError(null);
        } else {
          setError('City not found');
          setCity(null);
        }
      } catch (error) {
        setError('An error occurred while fetching data');
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    const intervalId = setInterval(updateCurrentTime, 1000);

    fetchApi();

    return () => clearInterval(intervalId);
  }, [search]);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(currentTime);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentTime);

  return (
    <>
      <div className='main-box'>
      <div className={`box-1 ${city && city.weather && city.weather[0] ? city.weather[0].main.toLowerCase() : ''}`}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '10px' }}>
            {city && city.sys && (
              <p style={{ color: 'white', fontSize: '25px' }}>{city.name}, {city.sys.country}</p>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', padding: '10px' }}>
            <p style={{ color: 'white', fontSize: '25px', marginBottom: '5px' }}>{formattedTime}</p>
            <p style={{ color: 'white', fontSize: '16px' }}>{formattedDate}</p>
          </div>
          <div style={{ position: 'absolute', bottom: '10px', right: '10px', padding: '10px' }}>
            {!loading && !error && city && city.main && (
              <p style={{ color: 'white', fontSize: '40px' }}>{city.main.temp}°C</p>
            )}
            {loading && <p style={{ color: 'white' }}>Loading...</p>}
            {!loading && error && <p style={{ color: 'white' }}>Error fetching data</p>}
          </div>
        </div>
        <div className='box'>
          <div className="weather-icon">
            <IoSunnyOutline size={70} />
          </div>
          <div className='inputData'>
            <input
              type='search'
              value={search}
              className='inputFeild'
              onChange={(e) => { setSearch(e.target.value) }}
            />
            <IoSearchCircleSharp size={40} color='white' />
          </div>
          <hr style={{ borderTop: '1px solid white', width: '80%', margin: '10px auto' }} />
          {loading && <p>Loading...</p>}
          {!loading && error && <p className='errorMsg' style={{color:'white'}}>{error}</p>}
          {!loading && !error && city && city.weather && city.weather[0] && (
            <>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1 style={{ color: "white", marginRight: "10px" }}>{city.weather[0].main}</h1>
                {city.weather[0].icon && (
                  <img src={`https://openweathermap.org/img/wn/${city.weather[0].icon}.png`} style={{ color: 'white', fontSize: '40px' }} />
                )}
              </div>
              <hr style={{ borderTop: '0.1px solid white', width: '40%', margin: '10px auto' }} />
              <h1 className='temp'>
                {city.main.temp}°C
              </h1>
              <h3 className='tempin_max' style={{ color: 'white' }}>Min: {city.main.temp_min}°C | Max: {city.main.temp_max}°C</h3>
              <hr style={{ borderTop: '0.1px solid white', width: '80%', margin: '10px auto' }} />
              <h5><ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ color: "white", display: 'flex', justifyContent: 'space-between', marginLeft: '30px', marginRight: '30px' }}>
                  <span>Humidity</span>
                  <span className="humidity">{Math.round(city.main.humidity)}%</span>
                </li>
                <hr style={{ borderTop: '1px solid white', width: '80%', margin: '10px auto' }} />

                <li style={{ color: "white", display: 'flex', justifyContent: 'space-between', marginLeft: '30px', marginRight: '30px' }}>
                  <span>Visibility</span>
                  <span className="visibility">{Math.round(city.visibility)} mi</span>
                </li>
                <hr style={{ borderTop: '1px solid white', width: '80%', margin: '10px auto' }} />

                <li style={{ color: "white", display: 'flex', justifyContent: 'space-between', marginLeft: '30px', marginRight: '30px' }}>
                  <span>Wind Speed</span>
                  <span className="wind-speed">{Math.round(city.wind.speed)} Km/h</span>
                </li>
                <hr style={{ borderTop: '1px solid white', width: '80%', margin: '10px auto' }} />
              </ul>
              </h5>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Weather;
