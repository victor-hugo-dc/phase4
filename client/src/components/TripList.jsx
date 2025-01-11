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

    // Add a new activity to a trip
    const handleAddNewActivity = async (tripId) => {
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
                const updatedTrips = trips.map((trip) =>
                    trip.id === tripId
                        ? { ...trip, activities: [...trip.activities, data] }
                        : trip
                );
                setTrips(updatedTrips);
                handleCloseNewActivityDialog();
            } else {
                alert(data.error || 'Error adding activity');
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    // Handle activity deletion
    const handleDeleteActivity = async (tripId, activityId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5555/activities/${activityId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedTrips = trips.map((trip) =>
                    trip.id === tripId
                        ? {
                            ...trip,
                            activities: trip.activities.filter((activity) => activity.id !== activityId),
                        }
                        : trip
                );
                setTrips(updatedTrips);
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
            {/* Render each trip */}
            {trips.map((trip) => (
                <Box key={trip.id} sx={{ marginBottom: 3, border: '1px solid #ddd', borderRadius: '8px', padding: 2 }}>
                    {/* Edit Trip */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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

                        {/* Buttons for editing/deleting */}
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

                    {/* Render Activities */}
                    <Box sx={{ marginTop: 2 }}>
                        <h3>Activities:</h3>
                        <List>
                            {trip.activities.map((activity) => {
                                const place = places.find((p) => p.id === activity.place_id);
                                return (
                                    <ListItem key={activity.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ marginRight: '10px' }}>•</span> {/* Bullet point */}
                                        <ListItemText
                                            primary={activity.name}
                                            secondary={
                                                <>
                                                    {activity.description}
                                                    <br />
                                                    Location: {place ? place.name : 'Unknown'}
                                                </>
                                            }
                                        />
                                        <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteActivity(trip.id, activity.id)}>
                                            Delete Activity
                                        </Button>
                                    </ListItem>
                                );
                            })}
                        </List>
                        <Button variant="contained" color="secondary" onClick={() => handleOpenNewActivityDialog(trip.id)}>
                            Add Activity
                        </Button>
                    </Box>

                    <Divider sx={{ marginTop: 2 }} />
                </Box>
            ))}

            {/* Dialog for adding a new activity */}
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
