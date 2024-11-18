export const mockData = {
    logs: [
      "Automation 'Night Mode' ran successfully at 22:00",
      "Temperature control activated at 24°C",
      "Humidity alert triggered at 75%",
      "Ventilation system activated at 14:30",
      "Light schedule executed at 18:00",
      "Water pump cycle completed at 09:15",
    ],
    
    sensors: [
      { valueName: "Temperature", value: "24°C" },
      { valueName: "Humidity", value: "65%" },
      { valueName: "CO2", value: "800" },
      { valueName: "Light", value: "5000" },
    ],
    
    controls: [
      { name: "Ventilation", state: true },
      { name: "Water Pump", state: false },
      { name: "Light Schedule", state: true },
      { name: "Night Mode", state: false },
    ]
  };