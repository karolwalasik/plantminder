
import { saveSensorHistory, saveAutomationLog } from './firebaseService';

class MockMqttService {
  constructor() {
    this.subscribers = new Map();


    

    const initialLogs = [
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        details: "Temperature exceeded 24°C. Fan activated.",
        devices: ["fan1"],
        action: "Turn on"
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        details: "Humidity below 50%. Sprinklers activated.",
        devices: ["sprinkler1"],
        action: "Turn on"
      },
      {
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        details: "Light intensity above 1000 lux. Blinds closed.",
        devices: ["blinds1"],
        action: "Turn on"
      }
    ];

    const controlStates = new Map();
    initialLogs.forEach(log => {
    log.devices.forEach(deviceId => {
      controlStates.set(deviceId, log.action === "Turn on");
    });
    });

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
        { id: 'sprinkler1', name: 'Sprinkler System', state: controlStates.get('sprinkler1') || false },
        { id: 'fan1', name: 'Ventilation Fan', state: controlStates.get('fan1') || false },
        { id: 'blinds1', name: 'Window Blinds', state: controlStates.get('blinds1') || false },
        { id: 'window1', name: 'Window Tilt', state: controlStates.get('window1') || false }
      ],
      logs: initialLogs
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
          const payload = JSON.parse(message);
          this.updateControlState(controlId, payload.state);
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
      const control = this.mockData.controls[controlIndex];
      
      // Update the control state
      this.mockData.controls[controlIndex] = {
        ...control,
        state: newState
      };
      
      // Publish the updated control state
      this.publishMessage(
        `plantiminder/controls/${controlId}`,
        this.mockData.controls[controlIndex]
      );
      
      // Generate a proper log entry
      const logEntry = {
        timestamp: new Date().toISOString(),
        details: `${control.name} manually ${newState ? 'activated' : 'deactivated'}`,
        devices: [controlId],
        action: newState ? 'Turn on' : 'Turn off'
      };
  
      // Publish the log
      this.publishMessage(
        'plantiminder/logs/system',
        logEntry
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
    this.updateInterval = setInterval(async () => {
      const randomSensor = this.mockData.sensors[Math.floor(Math.random() * this.mockData.sensors.length)];
      
      let currentValue = Number(randomSensor.value) || 0;
      const maxValue = Number(randomSensor.maxValue) || 100;
      const variation = (Math.random() - 0.5) * 2 * (maxValue * 0.05);
      let newValue = Math.max(0, Math.min(maxValue, currentValue + variation));
      newValue = Math.round(newValue);
      
      randomSensor.value = newValue;
      this.publishMessage(`plantiminder/sensors/${randomSensor.id}`, randomSensor);
      if(saveSensorHistory){
        await saveSensorHistory(randomSensor.id, newValue);
      } 
    
      // if (Math.random() < 0.3) {
        let automationAction;
        const currentControls = new Map(this.mockData.controls.map(c => [c.id, c.state]));
        
        switch(randomSensor.type) {
          case 'temperature':
            if (newValue >= 24 && !currentControls.get('fan1')) {
              automationAction = {
                details: "Temperature exceeded 24°C. Fan activated.",
                devices: ["fan1"],
                controlUpdates: [{ id: 'fan1', name: 'Ventilation Fan', state: true }]
              };
            } else if (newValue < 24 && currentControls.get('fan1')) {
              automationAction = {
                details: "Temperature below 24°C. Fan deactivated.",
                devices: ["fan1"],
                controlUpdates: [{ id: 'fan1', name: 'Ventilation Fan', state: false }]
              };
            }
            break;
  
          case 'humidity':
            if (newValue < 50 && !currentControls.get('sprinkler1')) {
              automationAction = {
                details: "Humidity below 50%. Sprinklers activated.",
                devices: ["sprinkler1"],
                controlUpdates: [{ id: 'sprinkler1', name: 'Sprinkler System', state: true }]
              };
            } else if (newValue > 80 && currentControls.get('sprinkler1')) {
              automationAction = {
                details: "Humidity above 80%. Sprinklers deactivated.",
                devices: ["sprinkler1"],
                controlUpdates: [{ id: 'sprinkler1', name: 'Sprinkler System', state: false }]
              };
            }
            break;
  
          case 'light':
            if (newValue > 1000 && !currentControls.get('blinds1')) {
              automationAction = {
                details: "Light intensity above 1000 lux. Blinds closed.",
                devices: ["blinds1"],
                controlUpdates: [{ id: 'blinds1', name: 'Window Blinds', state: true }]
              };
            } else if (newValue < 300 && currentControls.get('blinds1')) {
              automationAction = {
                details: "Light intensity below 300 lux. Blinds opened.",
                devices: ["blinds1"],
                controlUpdates: [{ id: 'blinds1', name: 'Window Blinds', state: false }]
              };
            }
            break;
  
          case 'moisture':
            if (newValue < 30 && !currentControls.get('sprinkler1')) {
              automationAction = {
                details: "Soil moisture below 30%. Watering system activated.",
                devices: ["sprinkler1"],
                controlUpdates: [{ id: 'sprinkler1', name: 'Sprinkler System', state: true }]
              };
            } else if (newValue > 60 && currentControls.get('sprinkler1')) {
              automationAction = {
                details: "Soil moisture above 60%. Watering system deactivated.",
                devices: ["sprinkler1"],
                controlUpdates: [{ id: 'sprinkler1', name: 'Sprinkler System', state: false }]
              };
            }
            break;
        }
    
  
        if (automationAction) {
          // Create and publish log entry
          const logEntry = {
            ...automationAction,
            timestamp: new Date().toISOString(),
            action: automationAction.controlUpdates[0].state ? 'Turn on' : 'Turn off'
          };
          this.publishMessage('plantiminder/logs/system', logEntry);
          await saveAutomationLog(logEntry);
  
          // Update and publish control states
          automationAction.controlUpdates.forEach(update => {
            const controlIndex = this.mockData.controls.findIndex(c => c.id === update.id);
            if (controlIndex !== -1) {
              this.mockData.controls[controlIndex] = {
                ...this.mockData.controls[controlIndex],
                state: update.state
              };
              this.publishMessage(
                `plantiminder/controls/${update.id}`,
                this.mockData.controls[controlIndex]
              );
            }
          });
        // }
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