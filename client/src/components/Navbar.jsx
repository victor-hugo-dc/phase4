import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#20359C' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Travel Journal
                </Typography>
                <Button color="inherit" component={Link} to="/places">
                    Places List
                </Button>
                <Button color="inherit" component={Link} to="/trips">
                    Trips
                </Button>
                <Button color="inherit" component={Link} to="/trips/new">
                    Add Trip
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
