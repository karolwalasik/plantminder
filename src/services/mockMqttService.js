class MockMqttService {
  constructor() {
    this.subscribers = new Map();
    this.mockData = {
      sensors: [
        { 
          id: 'temp1', 
          type: 'temperature', 
          value: 22, 
          valueName: 'Temperature',
          unit: '°C',
          maxValue: 50
        },
        { 
          id: 'hum1', 
          type: 'humidity', 
          value: 65, 
          valueName: 'Humidity',
          unit: '%',
          maxValue: 100
        },
        { 
          id: 'light1', 
          type: 'light', 
          value: 800, 
          valueName: 'Light',
          unit: 'lux',
          maxValue: 800
        },
        { 
          id: 'moist1', 
          type: 'moisture', 
          value: 45, 
          valueName: 'Moisture',
          unit: '%',
          maxValue: 100
        }
      ],
      controls: [
        { id: 'sprinkler1', name: 'Sprinkler System', state: false },
        { id: 'fan1', name: 'Ventilation Fan', state: false },
        { id: 'blinds1', name: 'Window Blinds', state: false },
        { id: 'window1', name: 'Window Tilt', state: false }
      ],
      logs: [
        'System started',
        'Humidity check completed',
        'Water pump activated',
        'Light cycle started'
      ]
    };
  }

  connect(options) {
    return {
      on: (event, callback) => {
        if (event === 'connect') {
          setTimeout(() => {
            callback();
            this.startMockDataUpdates();
          }, 1000);
        }
        if (event === 'message') {
          this.subscribers.set('message', callback);
        }
      },
      subscribe: (topic) => {
        console.log(`Subscribed to ${topic}`);
      },
      publish: (topic, message) => {
        console.log(`Published to ${topic}:`, message);
        if (topic.includes('/controls/') && topic.includes('/set')) {
          const controlId = topic.split('/')[2];
          const newState = JSON.parse(message).state;
          this.updateControlState(controlId, newState);
        }
      },
      end: () => {
        this.stopMockDataUpdates();
        console.log('Connection ended');
      }
    };
  }

  updateControlState(controlId, newState) {
    const controlIndex = this.mockData.controls.findIndex(c => c.id === controlId);
    if (controlIndex !== -1) {
      this.mockData.controls[controlIndex].state = newState;
      
      // Publish the updated control state
      this.publishMessage(
        `plantiminder/controls/${controlId}`,
        this.mockData.controls[controlIndex]
      );
      
      // Generate a log entry
      this.publishMessage(
        'plantiminder/logs/control',
        `${this.mockData.controls[controlIndex].name} turned ${newState ? 'on' : 'off'}`
      );
    }
  }

  publishMessage(topic, payload) {
    const callback = this.subscribers.get('message');
    if (callback) {
      callback(topic, JSON.stringify(payload));
    }
  }

  startMockDataUpdates() {
    // Initial data publish
    this.mockData.sensors.forEach(sensor => {
      this.publishMessage(`plantiminder/sensors/${sensor.id}`, sensor);
    });

    this.mockData.controls.forEach(control => {
      this.publishMessage(`plantiminder/controls/${control.id}`, control);
    });

    this.mockData.logs.forEach(log => {
      this.publishMessage('plantiminder/logs/system', log);
    });

    // Set up periodic updates
    
    this.updateInterval = setInterval(() => {
      // Update random sensor
      const randomSensor = this.mockData.sensors[Math.floor(Math.random() * this.mockData.sensors.length)];
      
      // Ensure we have valid current value and maxValue
      let currentValue = Number(randomSensor.value) || 0;
      const maxValue = Number(randomSensor.maxValue) || 100;
      
      // Calculate variation (5% of max value)
      const variation = (Math.random() - 0.5) * 2 * (maxValue * 0.05);
      
      // Calculate new value
      let newValue = currentValue + variation;
      
      // Ensure value stays within bounds
      newValue = Math.max(0, Math.min(maxValue, newValue));
      
      // Round to nearest integer
      newValue = Math.round(newValue);
      
      // Update sensor with new value
      randomSensor.value = newValue;
      this.publishMessage(`plantiminder/sensors/${randomSensor.id}`, randomSensor);

      // Occasionally generate a log
      if (Math.random() < 0.3) {
        const logMessages = [
          'Routine check completed',
          'Sensor readings normal',
          'System health: OK',
          'Environmental conditions stable'
        ];
        const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
        this.publishMessage('plantiminder/logs/system', randomLog);
      }
    }, 5000);
  }
  stopMockDataUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

export const mockMqttService = new MockMqttService();