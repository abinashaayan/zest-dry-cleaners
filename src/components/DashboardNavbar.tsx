import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './DashboardNavbar.css';

const DashboardNavbar: React.FC = () => {
  const [locationAnchor, setLocationAnchor] = React.useState<null | HTMLElement>(null);

  const handleLocationClick = (event: React.MouseEvent<HTMLElement>) => {
    setLocationAnchor(event.currentTarget);
  };

  const handleLocationClose = () => {
    setLocationAnchor(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#336B3F', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
        height: '100px', 
        display: 'flex', 
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: '100px' }}>
          <Box sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <Link to="/dashboard" className="dashboard-navbar__brand">
              <Typography 
                variant="h6" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'white', 
                  fontWeight: 600,
                }}
              >
                Zest Dry Cleaners
              </Typography>
            </Link>
            <Button 
              component={Link} 
              to="/my-orders" 
              color="inherit" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            >
              My Orders
            </Button>
            <Button 
              component={Link} 
              to="/services" 
              color="inherit" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            >
              Services
            </Button>
            <Button 
              component={Link} 
              to="/terms" 
              color="inherit" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            >
              Terms & Condition
            </Button>
            <Button 
              component={Link} 
              to="/privacy" 
              color="inherit" 
              sx={{ textTransform: 'none', fontWeight: 400 }}
            >
              Privacy Policy
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                cursor: 'pointer',
                color: 'white'
              }}
              onClick={handleLocationClick}
            >
              <LocationOnIcon />
              <Typography sx={{ color: 'white', fontWeight: 400 }}>
                Jakarta, Indonesia
              </Typography>
              <KeyboardArrowDownIcon />
            </Box>
            <Menu
              anchorEl={locationAnchor}
              open={Boolean(locationAnchor)}
              onClose={handleLocationClose}
            >
              <MenuItem onClick={handleLocationClose}>Jakarta, Indonesia</MenuItem>
              <MenuItem onClick={handleLocationClose}>Bandung, Indonesia</MenuItem>
              <MenuItem onClick={handleLocationClose}>Surabaya, Indonesia</MenuItem>
            </Menu>
            <IconButton color="inherit" sx={{ color: 'white' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" sx={{ color: 'white' }}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default DashboardNavbar;

