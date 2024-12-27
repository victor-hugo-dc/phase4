import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TripForm = () => {
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
                .min(
                    Yup.ref('start_date'),
                    'End date must be after start date'
                )
                .required('End date is required'),
        }),
        onSubmit: async (values) => {
            await fetch('http://localhost:5555/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            navigate('/trips');
        },
    });

    return (
        <Box
            sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '400px',
                margin: '0 auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Add a New Trip
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    name="name"
                    label="Trip Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    required
                    sx={{ marginBottom: '10px' }}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    name="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ marginBottom: '10px' }}
                    error={
                        formik.touched.description && Boolean(formik.errors.description)
                    }
                    helperText={formik.touched.description && formik.errors.description}
                />
                <TextField
                    name="start_date"
                    label="Start Date"
                    type="date"
                    value={formik.values.start_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '10px' }}
                    error={
                        formik.touched.start_date && Boolean(formik.errors.start_date)
                    }
                    helperText={formik.touched.start_date && formik.errors.start_date}
                />
                <TextField
                    name="end_date"
                    label="End Date"
                    type="date"
                    value={formik.values.end_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ marginBottom: '10px' }}
                    error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                    helperText={formik.touched.end_date && formik.errors.end_date}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add Trip
                </Button>
            </form>
        </Box>
    );
};

export default TripForm;
