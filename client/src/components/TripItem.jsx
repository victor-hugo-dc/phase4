import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    IconButton,
    Button,
    Dialog,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
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

    // Handle dialog toggling
    const handleEditOpen = () => setOpenEdit(true);
    const handleEditClose = () => setOpenEdit(false);
    const handleAddPlaceOpen = () => setOpenAddPlace(true);
    const handleAddPlaceClose = () => setOpenAddPlace(false);
    const handleAddActivityOpen = (placeId) => {
        setNewActivity({ ...newActivity, place_id: placeId });
        setOpenAddActivity(true);
    };
    const handleAddActivityClose = () => setOpenAddActivity(false);

    // Handle edit form change
    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    // Submit trip updates
    const handleEditSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5555/trips/${trip.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            const updatedTrip = await response.json();
            // Trigger a parent state update instead of directly modifying props
            trip.onUpdate(updatedTrip);
        } catch (error) {
            console.error('Error updating trip:', error);
        }
        setOpenEdit(false);
    };

    // Submit new place
    const handleAddPlaceSubmit = async () => {
        try {
            await addPlace(trip.id, newPlace);
            setNewPlace({ name: '', description: '' });
        } catch (error) {
            console.error('Error adding place:', error);
        }
        setOpenAddPlace(false);
    };

    // Submit new activity
    const handleAddActivitySubmit = async () => {
        try {
            await addActivity(newActivity);
            setNewActivity({ name: '', description: '', place_id: '' });
        } catch (error) {
            console.error('Error adding activity:', error);
        }
        setOpenAddActivity(false);
    };

    return (
        <Card sx={{ marginBottom: '20px' }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    {trip.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {trip.description}
                </Typography>
                <IconButton onClick={() => deleteTrip(trip.id)} color="error">
                    <DeleteIcon />
                </IconButton>
                <Button variant="outlined" onClick={handleEditOpen}>
                    Edit Trip
                </Button>
                <Button variant="outlined" onClick={handleAddPlaceOpen} sx={{ marginLeft: '10px' }}>
                    Add Place
                </Button>
            </CardContent>

            <Typography variant="h6" sx={{ padding: '10px' }}>
                Places
            </Typography>
            <List>
                {trip.places.map((place) => (
                    <PlaceItem
                        key={place.id}
                        place={place}
                        deletePlace={() => deletePlace(trip.id, place.id)}
                        openAddActivity={() => handleAddActivityOpen(place.id)}
                    />
                ))}
            </List>

            <Typography variant="h6" sx={{ padding: '10px' }}>
                Activities
            </Typography>
            <List>
                {trip.activities.map((activity) => (
                    <ActivityItem
                        key={activity.id}
                        activity={activity}
                        deleteActivity={() => deleteActivity(trip.id, activity.id)}
                    />
                ))}
            </List>

            {/* Edit Trip Dialog */}
            <Dialog open={openEdit} onClose={handleEditClose}>
                <DialogTitle>Edit Trip</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        value={editData.name}
                        onChange={handleEditChange}
                        sx={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        value={editData.description}
                        onChange={handleEditChange}
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Place Dialog */}
            <Dialog open={openAddPlace} onClose={handleAddPlaceClose}>
                <DialogTitle>Add Place</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Place Name"
                        fullWidth
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                        sx={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newPlace.description}
                        onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddPlaceClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddPlaceSubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Activity Dialog */}
            <Dialog open={openAddActivity} onClose={handleAddActivityClose}>
                <DialogTitle>Add Activity</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Activity Name"
                        fullWidth
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        sx={{ marginBottom: '10px' }}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddActivityClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddActivitySubmit} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TripItem;