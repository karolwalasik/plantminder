import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from 'react-router-dom';

const ErrorPage = () => {

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
        sx={{ textTransform: 'none' }}
        component={Link}
        to="/"
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;