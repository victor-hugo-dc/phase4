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
        setNewActivity({ ...newActivity, place_id: placeId }); // Set the place_id in the new activity data
        setOpenAddActivity(true);
    };
    const handleAddActivityClose = () => setOpenAddActivity(false);

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5555/trips/${trip.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            const updatedTrip = await response.json();
            trip.name = updatedTrip.name; // Update the trip object directly
            trip.description = updatedTrip.description;
        } catch (error) {
            console.error('Error updating trip:', error);
        }
        setOpenEdit(false); // Close dialog
    };

    const handleAddPlaceSubmit = async () => {
        try {
            const newPlaceData = await addPlace(trip.id, newPlace);
            if (newPlaceData) {
                setNewPlace({ name: '', description: '' }); // Reset form data
            }
        } catch (error) {
            console.error('Error adding place:', error);
        }
        setOpenAddPlace(false); // Close dialog
    };

    const handleAddActivitySubmit = async () => {
        try {
            const newActivityData = await addActivity({ ...newActivity, trip_id: trip.id });
            if (newActivityData) {
                setNewActivity({ name: '', description: '', place_id: '' }); // Reset form data
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
        setOpenAddActivity(false); // Close dialog
    };

    return (
        <Card sx={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h6">{trip.name}</Typography>
                <Typography>{trip.description}</Typography>

                <Button onClick={handleEditOpen}>Edit Trip</Button>
                <IconButton onClick={() => deleteTrip(trip.id)}>
                    <DeleteIcon />
                </IconButton>

                <Dialog open={openEdit} onClose={handleEditClose}>
                    <DialogTitle>Edit Trip</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Trip Name"
                            name="name"
                            value={editData.name}
                            onChange={handleEditChange}
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditClose} color="primary">Cancel</Button>
                        <Button onClick={handleEditSubmit} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>

                <Typography variant="h6">Places</Typography>
                <Button onClick={handleAddPlaceOpen}>Add Place</Button>
                {trip.places.map(place => (
                    <PlaceItem
                        key={place.id}
                        place={place}
                        deletePlace={deletePlace}
                        tripId={trip.id}
                        addActivity={handleAddActivityOpen}
                    />
                ))}

                <Dialog open={openAddPlace} onClose={handleAddPlaceClose}>
                    <DialogTitle>Add Place</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Place Name"
                            name="name"
                            value={newPlace.name}
                            onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Place Description"
                            name="description"
                            value={newPlace.description}
                            onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddPlaceClose} color="primary">Cancel</Button>
                        <Button onClick={handleAddPlaceSubmit} color="primary">Add</Button>
                    </DialogActions>
                </Dialog>

                <Typography variant="h6">Activities</Typography>
                {trip.activities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} deleteActivity={deleteActivity} tripId={trip.id} />
                ))}

                <Dialog open={openAddActivity} onClose={handleAddActivityClose}>
                    <DialogTitle>Add Activity</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Activity Name"
                            name="name"
                            value={newActivity.name}
                            onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Activity Description"
                            name="description"
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddActivityClose} color="primary">Cancel</Button>
                        <Button onClick={handleAddActivitySubmit} color="primary">Add</Button>
                    </DialogActions>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default TripItem;
