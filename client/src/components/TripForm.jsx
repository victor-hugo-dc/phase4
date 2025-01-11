import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TripForm = ({ setTrips }) => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            start_date: '',
            end_date: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .required('Required'),
            description: Yup.string()
                .max(200, 'Must be 200 characters or less')
                .required('Required'),
            start_date: Yup.date().required('Start date is required'),
            end_date: Yup.date()
                .min(Yup.ref('start_date'), 'End date must be after start date')
                .required('End date is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:5555/trips', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!response.ok) {
                    throw new Error('Failed to create trip');
                }

                const newTrip = await response.json();
                setTrips((prevTrips) => [...prevTrips, newTrip]);
                navigate('/trips');  // Redirect to the TripList page
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
                <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold' }}>
                    Create a New Trip
                </Typography>
                <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Trip Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        id="description"
                        name="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        multiline
                        rows={4}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        id="start_date"
                        name="start_date"
                        label="Start Date"
                        type="date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                        helperText={formik.touched.start_date && formik.errors.start_date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <TextField
                        fullWidth
                        id="end_date"
                        name="end_date"
                        label="End Date"
                        type="date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                        helperText={formik.touched.end_date && formik.errors.end_date}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit" sx={{ marginTop: 2 }}>
                        Submit
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default TripForm;
