import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useParams } from 'react-router-dom';

const TripDetail = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);

    // Fetch trip details, including places and their activities
    const fetchTrip = async () => {
        const response = await fetch(`http://localhost:5555/trips/${tripId}`);
        const data = await response.json();
        setTrip(data);
    };

    // Function to add an activity to a specific place
    const addActivity = async (placeId) => {
        const activityData = { name: 'New Activity', description: 'Description', place_id: placeId };
        await fetch(`http://localhost:5555/activities`, {
            method: 'POST',
            body: JSON.stringify(activityData),
            headers: { 'Content-Type': 'application/json' },
        });
        fetchTrip(); // Refresh the trip details after adding an activity
    };

    // Function to delete an activity
    const deleteActivity = async (activityId) => {
        await fetch(`http://localhost:5555/activities/${activityId}`, { method: 'DELETE' });
        fetchTrip(); // Refresh the trip details after deleting an activity
    };

    useEffect(() => {
        fetchTrip();
    }, [tripId]);

    if (!trip) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                {trip.name}
            </Typography>
            <Typography variant="body1">{trip.description}</Typography>
            <Typography variant="body2" sx={{ marginTop: '10px' }}>
                <strong>Start Date:</strong> {new Date(trip.start_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
                <strong>End Date:</strong> {new Date(trip.end_date).toLocaleDateString()}
            </Typography>

            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="h5">Places & Activities</Typography>
                {trip.places.map((place) => (
                    <Box key={place.id} sx={{ marginTop: '20px' }}>
                        <Typography variant="h6">{place.name}</Typography>
                        <Typography variant="body2">{place.description}</Typography>

                        <List>
                            {place.activities.map((activity) => (
                                <ListItem key={activity.id}>
                                    <ListItemText primary={activity.name} secondary={activity.description} />
                                    <Button onClick={() => deleteActivity(activity.id)} color="error">
                                        Delete Activity
                                    </Button>
                                </ListItem>
                            ))}
                        </List>

                        <Button onClick={() => addActivity(place.id)} variant="contained" color="primary">
                            Add Activity
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TripDetail;
