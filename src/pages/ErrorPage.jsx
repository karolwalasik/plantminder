import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage = () => {
  const handleBackToHome = () => {
    window.location.href = '/'; // Redirect to the home page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        We couldn't find the page you were looking for.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackToHome}
        sx={{ textTransform: 'none' }}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;