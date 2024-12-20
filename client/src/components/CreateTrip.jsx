import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function CreateTrip() {
    const formik = useFormik({
        initialValues: {
            name: '',
            startDate: '',
            endDate: '',
            description: '',
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, 'Trip name must be at least 3 characters')
                .required('Required'),
            startDate: Yup.date().required('Start date is required'),
            endDate: Yup.date().min(Yup.ref('startDate'), 'End date must be later than start date').required('End date is required'),
            description: Yup.string()
                .min(10, 'Description must be at least 10 characters')
                .required('Description is required'),
        }),
        onSubmit: (values) => {
            fetch('http://localhost:5555/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Trip created:', data);
                })
                .catch((error) => {
                    console.error('Error creating trip:', error);
                });
        },
    });

    return (
        <div>
            <h1>Create a Trip</h1>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name">Trip Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}
                </div>

                <div>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formik.values.startDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.startDate && formik.errors.startDate && <div>{formik.errors.startDate}</div>}
                </div>

                <div>
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formik.values.endDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.endDate && formik.errors.endDate && <div>{formik.errors.endDate}</div>}
                </div>

                <div>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description && <div>{formik.errors.description}</div>}
                </div>

                <button type="submit">Create Trip</button>
            </form>
        </div>
    );
}

export default CreateTrip;
