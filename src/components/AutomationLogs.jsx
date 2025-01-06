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
    const saved = localStorage.getItem('automationLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (logs && logs.length > 0) {
      setLogHistory(logs);
      localStorage.setItem('automationLogs', JSON.stringify(logs));
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
              {new Date(log.timestamp).toLocaleString()} - {log.details}
              {log.devices && ` (Devices: ${log.devices.join(', ')})`}
              {log.action && ` [${log.action}]`}
            </Typography>
          ))}
        </StyledBox2>
      </StyledBox>
    </>
  );
};

export default AutomationLogs;