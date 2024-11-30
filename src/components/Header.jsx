import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import styled from 'styled-components';
import logo from '../assets/logo192.png'; // Make sure to add your logo
import { COLORS } from '../constants/COLORS';
import { useUser } from './UserContext';
import { logOut } from '../services/firebaseService';


const StyledToolbar = styled(Toolbar)`
  justify-content: space-between; 
`;

const StyledLogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLinks = styled(Box)`
  display: none;
  align-items: center;
  gap: 32px;

  @media (min-width: 900px) {
    display: flex;
  }
`;

const MobileMenu = styled(IconButton)`
  display: flex;
  @media (min-width: 900px) {
    display: none;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.$active ? COLORS.PRIMARY_DARK : 'inherit'};
`;


const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="fixed" sx={{height: '110px',
        bgcolor: 'background.paper', 
        color: 'text.primary',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        borderBottomLeftRadius: '10px',
      borderBottomRightRadius: '10px',
        }}>
      <StyledToolbar>
        <StyledLogoLink to="/">
          <img src={logo} alt="Plantminder Logo" height="40" />
          <Typography 
  sx={{ 
    fontSize: { xs: '2rem', md: '3.2rem' }  
  }} 
  fontWeight="bold"
> 
            PLANTMINDER
          </Typography>
        </StyledLogoLink>

        {/* Desktop Navigation */}
        <NavLinks>
        {user && (
            <>
              <StyledLink to="/" $active={location.pathname === '/'}>
                <Typography>Dashboard</Typography>
              </StyledLink>
              <StyledLink to="/weather" $active={location.pathname === '/weather'}>
                <Typography>Weather</Typography>
              </StyledLink>
              <StyledLink to="/profile" $active={location.pathname === '/profile'}>
                <Typography>Profile</Typography>
              </StyledLink>
              <Button 
                onClick={handleLogout}
                variant="outlined"
                sx={{ 
                  color: COLORS.BLACK,
                  borderColor: COLORS.BLACK,
                  '&:hover': {
                    borderColor: COLORS.PRIMARY_DARK,
                    color: COLORS.PRIMARY_DARK
                  }
                }}
              >
                Logout
              </Button>
            </>
          )}
        </NavLinks>

        {/* Mobile Navigation */}
        <Box sx={{ display: { md: 'none', xs: 'flex' }, gap: 2, alignItems: 'center' }}>
          <StyledLink to="/profile">
            <Avatar 
              sx={{ width: 32, height: 32 }}
              alt="Profile"
              src="/path-to-profile-image.jpg" // Add your profile image path
            />
          </StyledLink>
          <MobileMenu
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
          >
            <MenuIcon />
          </MobileMenu>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {user && (
            <>
              <MenuItem onClick={() => { navigate('/'); setAnchorEl(null); }}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { navigate('/weather'); setAnchorEl(null); }}>
                Weather
              </MenuItem>
              <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); setAnchorEl(null); }}>
                Logout
              </MenuItem>
            </>
          )}
          </Menu>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;