import React, { useState } from 'react';
import { Card, CardContent, Typography, List, IconButton, Button, Dialog, TextField, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceItem from './PlaceItem';
import ActivityItem from './ActivityItem';

const TripItem = ({ trip, deleteTrip, deletePlace, deleteActivity, addPlace, addActivity }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({ name: trip.name, description: trip.description });

    const [openAddPlace, setOpenAddPlace] = useState(false);
    const [newPlace, setNewPlace] = useState({ name: '', description: '' });

    const [openAddActivity, setOpenAddActivity] = useState(false);
    const [newActivity, setNewActivity] = useState({ name: '', description: '', place_id: '' });

    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);

    const handleAddPlaceOpen = () => setOpenAddPlace(true);
    const handleAddPlaceClose = () => setOpenAddPlace(false);

    const handleAddActivityOpen = (placeId) => {
        setNewActivity({ ...newActivity, place_id: placeId });
        setOpenAddActivity(true);
    };
    const handleAddActivityClose = () => setOpenAddActivity(false);

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleAddPlaceSubmit = async () => {
        await addPlace(trip.id, newPlace); // Pass trip ID and new place data
        setNewPlace({ name: '', description: '' }); // Reset form data
        setOpenAddPlace(false); // Close dialog
    };
    
    const handleAddActivitySubmit = async () => {
        await addActivity({ ...newActivity, trip_id: trip.id }); // Include trip ID
        setNewActivity({ name: '', description: '', place_id: '' }); // Reset form data
        setOpenAddActivity(false); // Close dialog
    };
    

    const handleEditSubmit = async () => {
        // Update Trip details
        await fetch(`http://localhost:5555/trips/${trip.id}`, {
            method: 'PATCH',
            body: JSON.stringify(editData),
            headers: { 'Content-Type': 'application/json' },
        });
        setOpenEdit(false);
        window.location.reload(); // Refresh the page
    };

    const handleDeleteTrip = () => deleteTrip(trip.id);

    return (
        <Card sx={{ marginBottom: '20px', padding: '10px', border: '1px solid #ddd' }}>
            <CardContent>
                <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                    {trip.name}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                    {trip.description}
                </Typography>

                <Button variant="outlined" color="primary" onClick={handleEditOpen}>
                    Edit Trip
                </Button>

                <Typography variant="h6" sx={{ marginTop: '20px' }}>Places</Typography>
                <List>
                    {trip.places.map((place) => (
                        <PlaceItem
                            key={place.id}
                            place={place}
                            deletePlace={deletePlace}
                            tripId={trip.id}
                            addActivity={handleAddActivityOpen}
                        />
                    ))}
                </List>
                <Button variant="contained" color="primary" onClick={handleAddPlaceOpen} sx={{ marginTop: '10px' }}>
                    Add Place
                </Button>

                {trip.places.map((place) => (
                    <div key={place.id}>
                        <Typography variant="h6" sx={{ marginTop: '20px' }}>Activities at {place.name}</Typography>
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

                <IconButton color="error" onClick={handleDeleteTrip} sx={{ marginTop: '20px' }}>
                    <DeleteIcon />
                </IconButton>
            </CardContent>

            {/* Edit Trip Dialog */}
            <Dialog open={openEdit} onClose={handleEditClose}>
                <DialogTitle>Edit Trip</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        fullWidth
                        multiline
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Place Dialog */}
            <Dialog open={openAddPlace} onClose={handleAddPlaceClose}>
                <DialogTitle>Add Place</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={newPlace.description}
                        onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                        fullWidth
                        multiline
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddPlaceClose}>Cancel</Button>
                    <Button onClick={handleAddPlaceSubmit} variant="contained" color="primary">
                        Add Place
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Activity Dialog */}
            <Dialog open={openAddActivity} onClose={handleAddActivityClose}>
                <DialogTitle>Add Activity</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Name"
                        name="name"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        name="description"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        fullWidth
                        multiline
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddActivityClose}>Cancel</Button>
                    <Button onClick={handleAddActivitySubmit} variant="contained" color="primary">
                        Add Activity
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TripItem;
