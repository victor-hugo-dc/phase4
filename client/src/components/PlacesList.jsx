import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const PlacesList = ({ places, setPlaces }) => {
    const [newPlace, setNewPlace] = useState({ name: '', description: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlace({ ...newPlace, [name]: value });
    };

    const addPlace = async () => {
        try {
            const response = await fetch('http://localhost:5555/places', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlace),
            });

            if (!response.ok) {
                throw new Error('Failed to add place');
            }

            const newPlaceData = await response.json();
            setPlaces([...places, newPlaceData]);
            setNewPlace({ name: '', description: '' });
        } catch (error) {
            console.error('Error adding place:', error);
        }
    };

    const removePlace = async (placeId) => {
        try {
            await fetch(`http://localhost:5555/places/${placeId}`, { method: 'DELETE' });
            setPlaces(places.filter(place => place.id !== placeId));
        } catch (error) {
            console.error('Error deleting place:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Places List
            </Typography>

            {/* Display list of places */}
            <List>
                {places.map((place) => (
                    <ListItem key={place.id} secondaryAction={
                        <Button variant="outlined" color="error" onClick={() => removePlace(place.id)}>
                            Remove
                        </Button>
                    }>
                        <ListItemText
                            primary={place.name}
                            secondary={place.description}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Form to add a new place */}
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Add New Place</Typography>

                <TextField
                    fullWidth
                    label="Place Name"
                    name="name"
                    value={newPlace.name}
                    onChange={handleInputChange}
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={newPlace.description}
                    onChange={handleInputChange}
                    variant="outlined"
                    margin="normal"
                />

                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={addPlace}
                    sx={{ marginTop: 2 }}
                >
                    Add Place
                </Button>
            </Box>
        </Box>
    );
};

export default PlacesList;
