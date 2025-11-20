import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Navbar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ width: 250, backgroundColor: '#336B3F', height: '100%', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                    Zest Dry Cleaners
                </Typography>
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <List>
                <ListItem component={Link} to="/" onClick={handleDrawerToggle} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem component={Link} to="/terms" onClick={handleDrawerToggle} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary="Terms & Conditions" />
                </ListItem>
                <ListItem component={Link} to="/privacy" onClick={handleDrawerToggle} sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}>
                    <ListItemText primary="Privacy Policy" />
                </ListItem>
            </List>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    component={Link}
                    to="/login"
                    variant="outlined"
                    fullWidth
                    onClick={handleDrawerToggle}
                    sx={{
                        color: 'black',
                        backgroundColor: 'white',
                        borderColor: 'white',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#f5f5f5', borderColor: 'white' },
                    }}
                >
                    Log In
                </Button>
                <Button
                    component={Link}
                    to="/signup"
                    variant="contained"
                    fullWidth
                    onClick={handleDrawerToggle}
                    sx={{
                        backgroundColor: '#C9F8BA',
                        color: 'black',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#A4D6A2' },
                    }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );

    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#336B3F', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: { xs: '70px', sm: '80px', md: '100px' }, display: 'flex', justifyContent: 'center', }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: { xs: '70px', sm: '80px', md: '100px' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3, md: 5 } }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: { xs: 1, sm: 2 }, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Link to="/" className='text-decoration-none'>
                            <Typography variant="h6" sx={{ textDecoration: 'none', color: 'white', fontWeight: 600, ml: { xs: 0, md: 2 }, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
                                Zest Dry Cleaners
                            </Typography>
                        </Link>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: { md: 2, lg: 3 } }}>
                            <Button
                                component={Link}
                                to="/terms"
                                color="inherit"
                                variant="text"
                                disableRipple
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: { md: '0.9rem', lg: '1rem' },
                                    "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                                }}
                            >
                                Terms & Conditions
                            </Button>
                            <Button
                                component={Link}
                                to="/privacy"
                                color="inherit"
                                variant="text"
                                disableRipple
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 400,
                                    fontSize: { md: '0.9rem', lg: '1rem' },
                                    "&:hover": { backgroundColor: "transparent", textDecoration: "underline" },
                                }}
                            >
                                Privacy Policy
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: { md: 2, lg: 3 } }}>
                        <Link to="/login">
                            <Button variant="outlined" sx={{ color: 'black', backgroundColor: 'white', borderColor: 'white', textTransform: 'none', fontSize: { md: '0.9rem', lg: '1rem' }, '&:hover': { backgroundColor: '#f5f5f5', borderColor: 'white' }, }}>
                                Log In
                            </Button>
                        </Link>
                        <Typography sx={{ color: "white", display: { md: 'block', lg: 'block' } }}>|</Typography>
                        <Link to="/signup">
                            <Button variant="contained" sx={{ backgroundColor: '#C9F8BA', color: 'black', textTransform: 'none', fontSize: { md: '0.9rem', lg: '1rem' }, '&:hover': { backgroundColor: '#A4D6A2' }, }}>
                                Sign Up
                            </Button>
                        </Link>
                    </Box>
                </Toolbar>
            </Container>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;