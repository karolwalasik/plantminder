import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useMqttData = () => {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sensors, setSensors] = useState([]);
  const [controls, setControls] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    const options = {
        connectTimeout: 4000, // Czas oczekiwania na połączenie
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`, // Unikalny identyfikator klienta
        username: process.env.REACT_APP_MQTT_USERNAME, // Nazwa użytkownika z HiveMQ Cloud
        password: process.env.REACT_APP_MQTT_PASSWORD, // Hasło z HiveMQ Cloud
      };
  
      // Adres brokera HiveMQ Cloud
      const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL; // Używamy WebSocket dla React
    // MQTT client configuration
    const mqttClient = mqtt.connect(brokerUrl, options);

    setClient(mqttClient);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      setIsConnected(true);
      
      // Subscribe to all relevant topics
      mqttClient.subscribe('plantiminder/sensors/#');
      mqttClient.subscribe('plantiminder/controls/#');
      mqttClient.subscribe('plantiminder/logs/#');
    });

    mqttClient.on('message', (topic, message) => {
      const payload = JSON.parse(message.toString());
      
      if (topic.startsWith('plantiminder/sensors/')) {
        setSensors(prev => {
          const newSensors = [...prev];
          const sensorIndex = newSensors.findIndex(s => s.id === payload.id);
          
          if (sensorIndex === -1) {
            newSensors.push(payload);
          } else {
            newSensors[sensorIndex] = { ...newSensors[sensorIndex], ...payload };
          }
          
          return newSensors;
        });
      }
      
      if (topic.startsWith('plantiminder/controls/')) {
        setControls(prev => {
          const newControls = [...prev];
          const controlIndex = newControls.findIndex(c => c.id === payload.id);
          
          if (controlIndex === -1) {
            newControls.push(payload);
          } else {
            newControls[controlIndex] = { ...newControls[controlIndex], ...payload };
          }
          
          return newControls;
        });
      }
      
      if (topic.startsWith('plantiminder/logs/')) {
        setLogs(prev => [payload, ...prev].slice(0, 20)); // Keep last 20 logs
      }

      // If we have at least one piece of data, we can stop loading
      setIsLoading(false);
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const publishControl = (controlId, state) => {
    if (client && isConnected) {
        //set state to control
      client.publish(`plantiminder/controls/${controlId}/set`, JSON.stringify({ state }));
    }
  };

  return {
    isLoading,
    sensors,
    controls,
    logs,
    isConnected,
    publishControl
  };
};