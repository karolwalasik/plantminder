import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box, Typography } from '@mui/material';
import styled from 'styled-components';

const WeatherWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

const WeatherWidget = styled(Box)`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #00B4DB 0%, #0083B0 100%);
  
  .weatherwidget-io {
    width: 100%;
    height: 100%;
    
    & > * {
      width: 100% !important;
      height: 100% !important;
    }

    iframe {
      height: 400px !important;
    }
  }
`;

export const cities = [
  { label: 'Kraków', value: 'krakow', url: 'https://forecast7.com/pl/50d0619d94/krakow/' },
  { label: 'Warszawa', value: 'warsaw', url: 'https://forecast7.com/pl/52d2321d01/warsaw/' },
  { label: 'Wrocław', value: 'wroclaw', url: 'https://forecast7.com/pl/51d1117d04/wroclaw/' },
  { label: 'Poznań', value: 'poznan', url: 'https://forecast7.com/pl/52d4116d93/poznan/' },
  { label: 'Gdańsk', value: 'gdansk', url: 'https://forecast7.com/pl/54d3518d65/gdansk/' },
  { label: 'Łódź', value: 'lodz', url: 'https://forecast7.com/pl/51d7519d45/lodz/' },
  // Add more cities as needed
];

const WeatherPage = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [widgetKey, setWidgetKey] = useState(0);

  useEffect(() => {
    const existingScript = document.getElementById('weatherwidget-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'weatherwidget-script';
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [widgetKey]);

  const handleCityChange = (event, newValue) => {
    if (newValue) {
      setSelectedCity(newValue);
      setWidgetKey(prev => prev + 1);
    }
  };

  return (
    <WeatherWrapper>
      <Typography variant="h4" fontWeight="bold">
        Weather Forecast
      </Typography>
      
      <Autocomplete
        value={selectedCity}
        onChange={handleCityChange}
        options={cities}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select City"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
              }
            }}
          />
        )}
        sx={{
          maxWidth: '400px',
          '& .MuiAutocomplete-input': {
            fontSize: '1.6rem',
          }
        }}
      />

      <WeatherWidget>
        <a
        className="weatherwidget-io"
        href={selectedCity.url}
        data-label_1={selectedCity.label}
        data-label_2="Weather"
        data-theme="pure"
        data-basecolor="transparent"
        data-accent="#ffffff"
        data-textcolor="black"
        data-highcolor="#FFA500"
        data-lowcolor="#87CEEB"
        data-cloudcolor="#E8E8E8"
        data-raincolor="#87CEEB"
        data-snowcolor="#E8E8E8"
        data-mooncolor="#E8E8E8"
        data-suncolor="#FFD700"
        data-icons="Climacons Animated"
        data-mode="Both"           // Changed to "Both" to show current and forecast
        data-days="7"
        data-height="400"
        data-showicons="true"
        data-current="true"        // Ensure current weather is shown
        data-iconset="Climacons" 
        >
          {selectedCity.label} Weather
        </a>
      </WeatherWidget>
    </WeatherWrapper>
  );
};

export default WeatherPage;