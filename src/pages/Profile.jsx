import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { changePassword } from '../services/firebaseService';
import { useUser } from '../components/UserContext';
import { COLORS } from '../constants/COLORS';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
`;

export default function Profile() {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  const passwordFieldProps = (value, onChange, show, setShow) => ({
    fullWidth: true,
    type: show ? 'text' : 'password',
    value,
    onChange: (e) => onChange(e.target.value),
    InputProps: {
      startAdornment: (
        <InputAdornment position="start">
          <Lock sx={{ color: COLORS.GREY }} />
        </InputAdornment>
      ),
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={() => setShow(!show)} edge="end">
            {show ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
    sx: { 
      '& .MuiInputLabel-root.Mui-focused': {
        color: COLORS.PRIMARY_MAIN,
      },
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
          borderColor: COLORS.PRIMARY_MAIN,
        },
      },
    }
  });

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <StyledPaper>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Typography variant="h4" fontWeight="bold" color={COLORS.BLACK}>
            Profile Settings
          </Typography>

          <Typography variant="body1" color={COLORS.GREY}>
            Email: {user?.email}
          </Typography>

          <Typography variant="h5" color={COLORS.BLACK} sx={{ mt: 2 }}>
            Change Password
          </Typography>

          <TextField
            label="Current Password"
            {...passwordFieldProps(currentPassword, setCurrentPassword, showCurrentPassword, setShowCurrentPassword)}
          />

          <TextField
            label="New Password"
            {...passwordFieldProps(newPassword, setNewPassword, showNewPassword, setShowNewPassword)}
          />

          <TextField
            label="Confirm New Password"
            {...passwordFieldProps(confirmPassword, setConfirmPassword, showConfirmPassword, setShowConfirmPassword)}
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
            sx={{
              backgroundColor: COLORS.PRIMARY_MAIN,
              fontSize: '1.6rem',
              py: 1.5,
              '&:hover': {
                backgroundColor: COLORS.PRIMARY_DARK,
              },
            }}
          >
            Update Password
          </Button>
        </Box>
      </StyledPaper>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert 
          onClose={() => setSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Password successfully updated!
        </Alert>
      </Snackbar>
    </Container>
  );
}