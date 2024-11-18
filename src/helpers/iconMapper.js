import { ReactComponent as TemperatureIcon } from '../assets/Temperature.svg';
// Import other icons here

export const getIconByValueName = (valueName) => {
  const iconMap = {
    temperature: TemperatureIcon,
    // humidity: HumidityIcon,
    // Add more mappings as needed
  };

  return iconMap[valueName.toLowerCase()] || TemperatureIcon;
};