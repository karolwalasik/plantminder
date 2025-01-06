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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          setError(null);
          // Fetch sensor history
          const sensors = ['temp1', 'hum1', 'light1', 'moist1'];
          const newSensorHistory = { ...sensorHistory };
    
          for (const sensor of sensors) {
            try {
              const sensorRef = collection(db, `sensors/${sensor}/history`);
              const q = query(sensorRef, orderBy('timestamp', 'desc'), limit(100));
              const snapshot = await getDocs(q);
              
              const data = snapshot.docs
                .map(doc => {
                  const timestamp = doc.data().timestamp;
                  // Check if timestamp exists and is valid
                  if (!timestamp) return null;
                  
                  return {
                    timestamp: timestamp.toDate(),
                    value: doc.data().value || 0
                  };
                })
                .filter(item => item !== null) // Remove any null entries
                .sort((a, b) => a.timestamp - b.timestamp);
    
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
                default:
                  break;
              }
            } catch (error) {
              console.error(`Error fetching ${sensor} history:`, error);
              // Continue with other sensors even if one fails
            }
          }
          setSensorHistory(newSensorHistory);
    
          // Fetch automation history
          const automationRef = collection(db, 'automation_logs');
          const automationQuery = query(automationRef, orderBy('timestamp', 'desc'), limit(100));
          const automationSnapshot = await getDocs(automationQuery);
          
          const automationData = automationSnapshot.docs
            .map(doc => {
              const timestamp = doc.data().timestamp;
              if (!timestamp) return null;
              
              return {
                id: doc.id,
                ...doc.data(),
                timestamp: timestamp.toDate()
              };
            })
            .filter(item => item !== null);
          
          setAutomationHistory(automationData);
        } catch (error) {
          console.error('Error fetching history:', error);
          setError('Failed to load history data');
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchHistory();
    }, []);

    const renderSensorChart = (data, title, unit) => {
      if (!data || data.length === 0) {
        return (
          <ChartContainer>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography color="text.secondary">No data available</Typography>
          </ChartContainer>
        );
      }

      try {
        const xAxisData = data
          .filter(d => d && d.timestamp) // Ensure timestamp exists
          .map(d => d.timestamp.getTime());
        const yAxisData = data
          .filter(d => d && typeof d.value !== 'undefined')
          .map(d => d.value);

        if (xAxisData.length === 0 || yAxisData.length === 0) {
          return (
            <ChartContainer>
              <Typography variant="h6" gutterBottom>{title}</Typography>
              <Typography color="text.secondary">Insufficient data for chart</Typography>
            </ChartContainer>
          );
        }

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
                valueFormatter: (value) => {
                  try {
                    return new Date(value).toLocaleTimeString();
                  } catch (error) {
                    return '';
                  }
                },
              }]}
              height={300}
              margin={{ left: 50, right: 50, top: 20, bottom: 30 }}
            />
          </ChartContainer>
        );
      } catch (error) {
        console.error('Error rendering chart:', error);
        return (
          <ChartContainer>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Typography color="error">Error displaying chart</Typography>
          </ChartContainer>
        );
      }
    };

    if (isLoading) {
      return (
        <StyledBox>
          <Typography>Loading history data...</Typography>
        </StyledBox>
      );
    }

    if (error) {
      return (
        <StyledBox>
          <Typography color="error">{error}</Typography>
        </StyledBox>
      );
    }

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
            {automationHistory.length > 0 ? (
              automationHistory.map((log) => (
                <Box key={log.id} sx={{ mb: 2, p: 2, borderBottom: '1px solid #eee' }}>
                  <Typography variant="body1">
                    {log.timestamp?.toLocaleString()} - {log.details}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Devices: {log.devices?.join(', ') || 'None'} | Action: {log.action}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No automation history available</Typography>
            )}
          </Paper>
        </TabPanel>
      </StyledBox>
    );
};

export default History;