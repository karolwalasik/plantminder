import { ReactComponent as TemperatureIcon } from '../assets/thermometer-temperature.svg';
import { ReactComponent as HumidityIcon } from '../assets/Humidity.svg';
import { ReactComponent as LightIcon } from '../assets/Light.svg';
import { ReactComponent as SoilMoistureIcon } from '../assets/soil-moisture.svg';

// Import other icons here

export const getIconByValueName = (valueName) => {
  const iconMap = {
    temperature: TemperatureIcon,
    humidity: HumidityIcon,
    light: LightIcon,
    moisture: SoilMoistureIcon,
    // Add more mappings as needed
  };

  return iconMap[valueName.toLowerCase()] || TemperatureIcon;
};