import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
    return (
        <Box sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Welcome to the Travel Journal
            </Typography>
            <Typography variant="body1">
                Plan and manage your trips with ease. Add new trips, view all your planned adventures, and edit them as needed.
            </Typography>
        </Box>
    );
};

export default Home;
