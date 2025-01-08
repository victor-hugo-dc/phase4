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
        setTrips(trips.filter(trip => trip.id !== id)); // Update state after delete
    };

    const addActivity = async (activityData) => {
        const response = await fetch('http://localhost:5555/activities', {
            method: 'POST',
            body: JSON.stringify(activityData),
            headers: { 'Content-Type': 'application/json' },
        });
        const newActivity = await response.json();
        setTrips(trips.map(trip => 
            trip.id === activityData.trip_id
                ? { ...trip, activities: [...trip.activities, newActivity] }
                : trip
        )); // Add activity to state
    };
    
    const addPlace = async (tripId, placeData) => {
        const response = await fetch('http://localhost:5555/places', {
            method: 'POST',
            body: JSON.stringify({ ...placeData, trip_id: tripId }),
            headers: { 'Content-Type': 'application/json' },
        });
        const newPlace = await response.json();
        setTrips(trips.map(trip =>
            trip.id === tripId
                ? { ...trip, places: [...trip.places, newPlace] }
                : trip
        )); // Add place to state
    };

    const deleteActivity = async (tripId, activityId) => {
        await fetch(`http://localhost:5555/activities/${activityId}`, { method: 'DELETE' });
        setTrips(trips.map(trip => ({
            ...trip,
            activities: trip.activities.filter(activity => activity.id !== activityId)
        }))); // Remove activity from state
    };

    const deletePlace = async (tripId, placeId) => {
        await fetch(`http://localhost:5555/places/${placeId}`, { method: 'DELETE' });
        setTrips(trips.map(trip => ({
            ...trip,
            places: trip.places.filter(place => place.id !== placeId)
        }))); // Remove place from state
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
