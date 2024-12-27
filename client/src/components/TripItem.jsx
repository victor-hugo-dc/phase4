import React from 'react';
import { Card, CardContent, Typography, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceItem from './PlaceItem';
import ActivityItem from './ActivityItem';

const TripItem = ({ trip, deleteTrip, deletePlace, deleteActivity }) => {
    const handleDeleteTrip = () => {
        deleteTrip(trip.id); // Delete the entire trip
    };

    return (
        <Card sx={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <CardContent>
                <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                    {trip.name}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                    {trip.description}
                </Typography>

                <Typography variant="h6">Places</Typography>
                <List>
                    {trip.places.map((place) => (
                        <PlaceItem
                            key={place.id}
                            place={place}
                            deletePlace={deletePlace}
                            tripId={trip.id}
                        />
                    ))}
                </List>

                {trip.places.map((place) => (
                    <div key={place.id}>
                        <Typography variant="h6" sx={{ marginTop: '20px' }}>
                            Activities at {place.name}
                        </Typography>
                        <List>
                            {place.activities.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    deleteActivity={deleteActivity}
                                    tripId={trip.id}
                                />
                            ))}
                        </List>
                    </div>
                ))}

                <IconButton
                    color="error"
                    onClick={handleDeleteTrip}
                    sx={{ marginTop: '20px' }}
                >
                    <DeleteIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default TripItem;
