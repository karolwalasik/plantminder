import { useState, useEffect } from 'react';
import { mockMqttService } from '../services/mockMqttService';

export const useMockMqttData = () => {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sensors, setSensors] = useState([]);
  const [controls, setControls] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttClient = mockMqttService.connect({
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    });

    setClient(mqttClient);

    mqttClient.on('connect', () => { 
      console.log('Connected to mock MQTT broker');
      setIsConnected(true);
      
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
        setLogs(prev => [payload, ...prev].slice(0, 20));
      }

      setIsLoading(false);
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const publishControl = (controlId, control, state) => {
    if (client && isConnected) {
      client.publish(
        `plantiminder/controls/${controlId}/set`, 
        JSON.stringify({
          id: controlId,
          name: control.name,
          state: state
        })
      );
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