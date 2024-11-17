import React, { useEffect } from 'react';

const WeatherPage = () => {
  useEffect(() => {
    // Inject the WeatherWidget.io script
    const script = document.createElement('script');
    script.src = 'https://weatherwidget.io/js/widget.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Weather Page</h1>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
      <a class="weatherwidget-io" href="https://forecast7.com/pl/50d0619d94/krakow/" data-label_1="Kraków" data-label_2="Pogoda" data-theme="original" >Kraków Pogoda</a>
      </div>
    </div>
  );
};

export default WeatherPage;