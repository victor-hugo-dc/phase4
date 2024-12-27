import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

const TripList = () => {
    const [trips, setTrips] = useState([]);

    const fetchTrips = async () => {
        const response = await fetch('http://localhost:5555/trips');
        const data = await response.json();
        setTrips(data);
    };

    const deleteTrip = async (id) => {
        await fetch(`http://localhost:5555/trips/${id}`, { method: 'DELETE' });
        fetchTrips();
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                All Trips
            </Typography>
            {trips.map((trip) => (
                <Paper key={trip.id} sx={{ padding: '15px', marginBottom: '10px' }}>
                    <Typography variant="h6">{trip.name}</Typography>
                    <Typography variant="body1">{trip.description}</Typography>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{ marginTop: '10px' }}
                        onClick={() => deleteTrip(trip.id)}
                    >
                        Delete
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default TripList;
