import { Typography, Box } from "@mui/material";
import styled from "styled-components";
import { useEffect, useState } from "react";

const StyledBox = styled(Box)`
  height: 138px;
  overflow: hidden;
`;

const StyledBox2 = styled(Box)`
  overflow-y: scroll;
  height: 100%;
`;

const MAX_LOGS = 20; // Maximum number of logs to store

const AutomationLogs = ({ logs }) => {
  const [logHistory, setLogHistory] = useState(() => {
    // Initialize from localStorage on component mount
    const saved = localStorage.getItem('automationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (logs && logs.length > 0) {
      // Add timestamp to new logs
      const newLogs = logs.map(log => ({
        message: log,
        timestamp: new Date().toISOString()
      }));

      // Combine new logs with existing ones, remove duplicates, and limit the total
      setLogHistory(prevLogs => {
        const combined = [...newLogs, ...prevLogs];
        const unique = Array.from(new Map(
          combined.map(log => [log.message, log])
        ).values());
        
        const limited = unique.slice(0, MAX_LOGS);
        
        // Save to localStorage
        localStorage.setItem('automationLogs', JSON.stringify(limited));
        
        return limited;
      });
    }
  }, [logs]);

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        RECENT AUTOMATION RUNS:
      </Typography>
      <StyledBox
        sx={{
          width: "100%",
          bgcolor: "rgba(0, 0, 0, 0.05)",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <StyledBox2>
          {logHistory.map((log, index) => (
            <Typography key={index} sx={{ mb: 0.5 }}>
              {new Date(log.timestamp).toLocaleString()} - {log.message}
            </Typography>
          ))}
        </StyledBox2>
      </StyledBox>
    </>
  );
};

export default AutomationLogs;