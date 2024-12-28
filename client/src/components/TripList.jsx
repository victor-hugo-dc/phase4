import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import TripItem from './TripItem';

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

    const addActivity = async (activityData) => {
        await fetch(`http://localhost:5555/activities`, {
            method: 'POST',
            body: JSON.stringify(activityData),
            headers: { 'Content-Type': 'application/json' },
        });
        fetchTrips();
    };
    
    const addPlace = async (tripId, placeData) => {
        await fetch(`http://localhost:5555/places`, {
            method: 'POST',
            body: JSON.stringify({ ...placeData, trip_id: tripId }),
            headers: { 'Content-Type': 'application/json' },
        });
        fetchTrips();
    };
    

    const deleteActivity = async (tripId, activityId) => {
        await fetch(`http://localhost:5555/activities/${activityId}`, { method: 'DELETE' });
        fetchTrips();
    };

    const deletePlace = async (tripId, placeId) => {
        await fetch(`http://localhost:5555/places/${placeId}`, { method: 'DELETE' });
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
                <TripItem
                    key={trip.id}
                    trip={trip}
                    deleteTrip={deleteTrip}
                    addActivity={addActivity}
                    addPlace={addPlace}
                    deleteActivity={deleteActivity}
                    deletePlace={deletePlace}
                />
            ))}
        </Box>
    );
};

export default TripList;
