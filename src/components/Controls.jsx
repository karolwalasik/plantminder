import { Box, Typography, Switch } from "@mui/material";
import styled from "styled-components";
import { COLORS } from '../constants/COLORS';
import { useTheme } from "@mui/material/styles";

const ControlsWrapper = styled(Box)`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 32px;
  width: 100%;

  ${(props) => props.theme.breakpoints.down("sm")} {
    justify-content: center;
  }
`;

const Controls = ({ controls, onControlChange }) => {
  const theme = useTheme();

  return (
    <ControlsWrapper theme={theme}>
      {controls.map((control, index) => (
        <Box
          key={control.id}
          sx={{
            display: "flex",
            borderRadius: '20px',
            width:'300px',
            height:'80px',
            justifyContent: 'space-between',
            border: `2px solid ${COLORS.GREY}`,
            alignItems: 'center',
            padding:'24px'
          }}
        >
          <Typography>{control.name}</Typography>
          <Switch 
             checked={control.state} 
             onChange={(e) => onControlChange(control.id, e.target.checked)} 
          />
        </Box>
      ))}
    </ControlsWrapper>
  );
};

export default Controls;