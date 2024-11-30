import React, { useState } from 'react';
import { signIn } from '../services/firebaseService';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import styled from 'styled-components';
import { COLORS } from '../constants/COLORS';
import logo from '../assets/logo_hq.png';

const StyledPaper = styled(Paper)`
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 24px;
`;

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <StyledPaper elevation={3}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Logo src={logo} alt="Plantminder Logo" />
            
            <Typography variant="h4" fontWeight="bold" color={COLORS.BLACK}>
              PLANTMINDER
            </Typography>

            <Typography variant="h5" color={COLORS.GREY}>
              Sign In
            </Typography>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: COLORS.GREY }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiInputLabel-root.Mui-focused': {
                  color: COLORS.PRIMARY_MAIN,
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.PRIMARY_MAIN,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: COLORS.GREY }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiInputLabel-root.Mui-focused': {
                  color: COLORS.PRIMARY_MAIN,
                },
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.PRIMARY_MAIN,
                  },
                },
              }}
            />

            {error && (
              <Typography 
                color="error" 
                sx={{ 
                  fontSize: '1.4rem',
                  textAlign: 'center' 
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: COLORS.PRIMARY_MAIN,
                fontSize: '1.6rem',
                py: 1.5,
                '&:hover': {
                  backgroundColor: COLORS.PRIMARY_DARK,
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
}