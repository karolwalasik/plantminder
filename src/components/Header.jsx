import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import styled from 'styled-components';
import logo from '../assets/logo192.png'; // Make sure to add your logo
import { COLORS } from '../constants/COLORS';


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
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();

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
          <StyledLink to="/" $active={isActive('/') || isActive('/dashboard')}>
            <Typography>Dashboard</Typography>
          </StyledLink>
          <StyledLink to="/weather" $active={isActive('/weather')}>
            <Typography>Weather</Typography>
          </StyledLink>
          <StyledLink to="/profile" $active={isActive('/profile')}>
            <Avatar 
              sx={{ width: 40, height: 40 }}
              alt="Profile"
              src="/path-to-profile-image.jpg" // Add your profile image path
            />
          </StyledLink>
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
            <MenuItem onClick={handleClose} component={Link} to="/">
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/weather">
              Weather
            </MenuItem>
          </Menu>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;