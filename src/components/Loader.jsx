import { Box, CircularProgress, Typography } from '@mui/material';
import styled from 'styled-components';
import logo from '../assets/logo192.png'; 
import { COLORS } from '../constants/COLORS';

const LoaderWrapper = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  gap: 24px;
  z-index: 9999;
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <Logo src={logo} alt="Plantiminder Logo" />
      <Typography variant="h4" fontWeight="bold">
        PLANTIMINDER
      </Typography>
      <CircularProgress 
        size={60} 
        thickness={2} 
        sx={{ color: COLORS.BLACK }} 
      />
      <Typography variant="h6"  sx={{ color: COLORS.BLACK }} >
        LOADING...
      </Typography>
    </LoaderWrapper>
  );
};

export default Loader;