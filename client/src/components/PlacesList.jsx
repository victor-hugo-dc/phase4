import React from 'react';
import { TextField, Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PlacesList = ({ places, setPlaces }) => {
    const formik = useFormik({
        initialValues: { name: '', description: '' },
        validationSchema: Yup.object({
            name: Yup.string()
                .required('Place name is required')
                .min(2, 'Name must be at least 2 characters'),
            description: Yup.string()
                .required('Description is required')
                .min(5, 'Description must be at least 5 characters'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const response = await fetch('http://localhost:5555/places', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error('Failed to add place');
                }

                const newPlaceData = await response.json();
                setPlaces([...places, newPlaceData]);
                resetForm();
            } catch (error) {
                console.error('Error adding place:', error);
            }
        },
    });

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
                    <ListItem
                        key={place.id}
                        secondaryAction={
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removePlace(place.id)}
                            >
                                Remove
                            </Button>
                        }
                    >
                        <ListItemText
                            primary={place.name}
                            secondary={place.description}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Form to add a new place */}
            <Box sx={{ marginTop: 3 }} component="form" onSubmit={formik.handleSubmit}>
                <Typography variant="h6">Add New Place</Typography>

                <TextField
                    fullWidth
                    label="Place Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="outlined"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    variant="outlined"
                    margin="normal"
                />

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                >
                    Add Place
                </Button>
            </Box>
        </Box>
    );
};

export default PlacesList;
