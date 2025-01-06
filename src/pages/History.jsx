import { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import styled from 'styled-components';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseService'
import { LineChart } from '@mui/x-charts/LineChart';

const StyledBox = styled(Box)`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChartContainer = styled(Paper)`
  padding: 20px;
  margin: 20px 0;
  height: 400px;
`;

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ marginTop: '20px' }}>
    {value === index && children}
  </div>
);

const History = () => {
    const [tabValue, setTabValue] = useState(0);
    const [sensorHistory, setSensorHistory] = useState({
      temperature: [],
      humidity: [],
      light: [],
      moisture: []
    });
    const [automationHistory, setAutomationHistory] = useState([]);
  
    useEffect(() => {
      const fetchHistory = async () => {
        // Fetch sensor history
        const sensors = ['temp1', 'hum1', 'light1', 'moist1'];
        const newSensorHistory = { ...sensorHistory };
  
        for (const sensor of sensors) {
          const sensorRef = collection(db, `sensors/${sensor}/history`);
          const q = query(sensorRef, orderBy('timestamp', 'desc'), limit(100));
          const snapshot = await getDocs(q);
          
          const data = snapshot.docs
            .map(doc => ({
              timestamp: doc.data().timestamp.toDate(),
              value: doc.data().value
            }))
            .sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp ascending
  
          switch(sensor) {
            case 'temp1':
              newSensorHistory.temperature = data;
              break;
            case 'hum1':
              newSensorHistory.humidity = data;
              break;
            case 'light1':
              newSensorHistory.light = data;
              break;
            case 'moist1':
              newSensorHistory.moisture = data;
              break;
          }
        }
        setSensorHistory(newSensorHistory);
  
        // Fetch automation history
        const automationRef = collection(db, 'automation_logs');
        const automationQuery = query(automationRef, orderBy('timestamp', 'desc'), limit(100));
        const automationSnapshot = await getDocs(automationQuery);
        
        setAutomationHistory(automationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })));
      };
  
      fetchHistory();
    }, []);
  
    const renderSensorChart = (data, title, unit) => {
      if (!data || data.length === 0) return null;
  
      const xAxisData = data.map(d => d.timestamp.getTime()); // Convert to milliseconds
      const yAxisData = data.map(d => d.value);
  
      return (
        <ChartContainer>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <LineChart
            series={[
              {
                data: yAxisData,
                label: unit,
                curve: "linear",
                showMark: false,
              },
            ]}
            xAxis={[{
              data: xAxisData,
              scaleType: 'time',
              valueFormatter: (value) => new Date(value).toLocaleTimeString(),
            }]}
            height={300}
            margin={{ left: 50, right: 50, top: 20, bottom: 30 }}
          />
        </ChartContainer>
      );
    };
  
    return (
      <StyledBox>
        <Typography variant="h4" gutterBottom>History</Typography>
        
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Sensor History" />
          <Tab label="Automation History" />
        </Tabs>
  
        <TabPanel value={tabValue} index={0}>
          {renderSensorChart(sensorHistory.temperature, 'Temperature History', '°C')}
          {renderSensorChart(sensorHistory.humidity, 'Humidity History', '%')}
          {renderSensorChart(sensorHistory.light, 'Light History', 'lux')}
          {renderSensorChart(sensorHistory.moisture, 'Moisture History', '%')}
        </TabPanel>
  
        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 2 }}>
            {automationHistory.map((log) => (
              <Box key={log.id} sx={{ mb: 2, p: 2, borderBottom: '1px solid #eee' }}>
                <Typography variant="body1">
                  {log.timestamp.toLocaleString()} - {log.details}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Devices: {log.devices.join(', ')} | Action: {log.action}
                </Typography>
              </Box>
            ))}
          </Paper>
        </TabPanel>
      </StyledBox>
    );
  };
  
  export default History; 