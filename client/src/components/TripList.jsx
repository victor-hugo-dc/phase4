import React, { useState } from 'react';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Divider, Box } from '@mui/material';

const TripList = ({ trips, places, setTrips }) => {
    const [newActivityDialogOpen, setNewActivityDialogOpen] = useState(null);
    const [activityName, setActivityName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    const [selectedPlace, setSelectedPlace] = useState('');
    const [editTripId, setEditTripId] = useState(null);
    const [tripName, setTripName] = useState('');
    const [tripDescription, setTripDescription] = useState('');

    // Open and close dialogs
    const handleOpenNewActivityDialog = (tripId) => setNewActivityDialogOpen(tripId);
    const handleCloseNewActivityDialog = () => setNewActivityDialogOpen(null);

    const handleOpenEditTripDialog = (tripId, name, description) => {
        setEditTripId(tripId);
        setTripName(name);
        setTripDescription(description);
    };

    const handleCloseEditTripDialog = () => setEditTripId(null);

    const handleAddNewActivity = async (tripId) => {
        if (!activityName.trim() || !activityDescription.trim() || !selectedPlace) {
            alert('Please fill out all fields and select a place.');
            return;
        }

        const newActivity = {
            name: activityName,
            description: activityDescription,
            place_id: selectedPlace,
            trip_id: tripId,
        };

        try {
            const response = await fetch('http://127.0.0.1:5555/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity),
            });

            const data = await response.json();

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) => {
                        if (trip.id !== tripId) return trip;

                        // Check if the place already exists in the trip
                        const placeExists = trip.places?.find(place => place.id === selectedPlace);

                        let updatedPlaces;
                        if (placeExists) {
                            // Add the new activity to the existing place
                            updatedPlaces = trip.places.map((place) =>
                                place.id === selectedPlace
                                    ? {
                                        ...place,
                                        activities: [...(place.activities || []), data],
                                    }
                                    : place
                            );
                        } else {
                            // Add a new place with the new activity
                            updatedPlaces = [
                                ...(trip.places || []),
                                {
                                    id: selectedPlace,
                                    name: data.place.name || 'New Place', // Replace with actual place name if available
                                    description: data.place.description || '',
                                    activities: [data],
                                },
                            ];
                        }

                        return { ...trip, places: updatedPlaces };
                    })
                );

                setActivityName('');
                setActivityDescription('');
                setSelectedPlace('');
                handleCloseNewActivityDialog();
            } else {
                alert(data.error || 'Failed to add activity.');
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('An error occurred while adding the activity.');
        }
    };


    // Handle activity deletion
    const handleDeleteActivity = async (tripId, placeId, activityId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/activities/${activityId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTrips((prevTrips) =>
                    prevTrips.map((trip) => {
                        if (trip.id !== tripId) return trip;

                        const updatedPlaces = trip.places
                            .map((place) =>
                                place.id === placeId
                                    ? {
                                        ...place,
                                        activities: place.activities.filter((activity) => activity.id !== activityId),
                                    }
                                    : place
                            )
                            .filter((place) => place.activities.length > 0);

                        return { ...trip, places: updatedPlaces };
                    })
                );
            } else {
                alert('Error deleting activity');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
        }
    };

    // Handle trip update
    const handleUpdateTrip = async () => {
        const updatedTrip = {
            name: tripName,
            description: tripDescription,
        };

        try {
            const response = await fetch(`http://127.0.0.1:5555/trips/${editTripId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTrip),
            });
            const data = await response.json();
            if (response.ok) {
                const updatedTrips = trips.map((trip) =>
                    trip.id === editTripId ? { ...trip, name: data.name, description: data.description } : trip
                );
                setTrips(updatedTrips);
                handleCloseEditTripDialog();
            } else {
                alert(data.error || 'Error updating trip');
            }
        } catch (error) {
            console.error('Error updating trip:', error);
        }
    };

    // Handle trip deletion
    const handleDeleteTrip = async (tripId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/trips/${tripId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedTrips = trips.filter((trip) => trip.id !== tripId);
                setTrips(updatedTrips);
            } else {
                alert('Error deleting trip');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            {trips.map((trip) => (
                <Box key={trip.id} sx={{ marginBottom: 3, border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        {editTripId === trip.id ? (
                            <Box sx={{ width: '80%' }}>
                                <TextField
                                    label="Trip Name"
                                    fullWidth
                                    value={tripName}
                                    onChange={(e) => setTripName(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                                <TextField
                                    label="Trip Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={tripDescription}
                                    onChange={(e) => setTripDescription(e.target.value)}
                                    sx={{ marginBottom: 2 }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{ width: '80%' }}>
                                <h2>{trip.name}</h2>
                                <p>{trip.description}</p>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {editTripId === trip.id ? (
                                <>
                                    <Button variant="contained" color="primary" onClick={handleUpdateTrip} sx={{ marginBottom: 1 }}>
                                        Save
                                    </Button>
                                    <Button variant="outlined" onClick={handleCloseEditTripDialog}>
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outlined" color="secondary" onClick={() => handleOpenEditTripDialog(trip.id, trip.name, trip.description)} sx={{ marginBottom: 1 }}>
                                        Edit Trip
                                    </Button>
                                    <Button variant="outlined" color="error" onClick={() => handleDeleteTrip(trip.id)}>
                                        Delete Trip
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>


                    {/* Places and Activities */}
                    {trip.places && trip.places.map((place) => (
                        <Box key={place.id} sx={{ marginTop: 2 }}>
                            <h3>{place.name}</h3>
                            <p>{place.description}</p>
                            <List>
                                {place.activities.map((activity) => (
                                    <ListItem key={activity.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '10px' }}>•</span>
                                        <ListItemText primary={activity.name} secondary={activity.description} />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDeleteActivity(trip.id, place.id, activity.id)}
                                        >
                                            Delete Activity
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    ))}

                    {/* Add Activity Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenNewActivityDialog(trip.id)}
                        sx={{ marginTop: 2 }}
                    >
                        Add Activity
                    </Button>

                    <Divider sx={{ marginTop: 2 }} />
                </Box>
            ))}


            {newActivityDialogOpen !== null && (
                <Dialog open={true} onClose={handleCloseNewActivityDialog}>
                    <DialogTitle>Add New Activity</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Activity Name"
                            fullWidth
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Activity Description"
                            fullWidth
                            multiline
                            rows={4}
                            value={activityDescription}
                            onChange={(e) => setActivityDescription(e.target.value)}
                            sx={{ marginBottom: 2 }}
                        />
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel>Place</InputLabel>
                            <Select
                                value={selectedPlace}
                                onChange={(e) => setSelectedPlace(e.target.value)}
                                label="Place"
                            >
                                {places.map((place) => (
                                    <MenuItem key={place.id} value={place.id}>
                                        {place.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseNewActivityDialog}>Cancel</Button>
                        <Button onClick={() => handleAddNewActivity(newActivityDialogOpen)}>Add Activity</Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default TripList;
