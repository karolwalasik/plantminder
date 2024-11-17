import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const MQTTComponent = () => {
  // Stan do przechowywania danych MQTT
  const [data, setData] = useState(null);

  useEffect(() => {
    // Konfiguracja połączenia z HiveMQ Cloud
    const options = {
      connectTimeout: 4000, // Czas oczekiwania na połączenie
      clientId: `mqtt_${Math.random().toString(16).slice(3)}`, // Unikalny identyfikator klienta
      username: process.env.REACT_APP_MQTT_USERNAME, // Nazwa użytkownika z HiveMQ Cloud
      password: process.env.REACT_APP_MQTT_PASSWORD, // Hasło z HiveMQ Cloud
    };

    // Adres brokera HiveMQ Cloud
    const brokerUrl = process.env.REACT_APP_MQTT_BROKER_URL; // Używamy WebSocket dla React

    // Połączenie z brokerem MQTT
    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
      console.log('Connected to HiveMQ Cloud');
      // Subskrypcja tematu
      client.subscribe('temp', (err) => {
        if (!err) {
          console.log('Subscribed to topic: temp');
        } else {
          console.error('Failed to subscribe:', err);
        }
      });
    });

    client.on('message', (topic, message) => {
      console.log(`Message received from ${topic}:`, message.toString());
      setData(JSON.parse(message.toString())); // Zapisz dane w stanie
    });

    client.on('error', (err) => {
      console.error('Connection error:', err);
    });

    // Czyszczenie połączenia
    return () => {
      if (client.connected) {
        client.end();
      }
    };
  }, []); // Pusty array jako zależność - uruchamia efekt tylko raz

  return (
    <div>
      <h1>MQTT Data</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
};

export default MQTTComponent;