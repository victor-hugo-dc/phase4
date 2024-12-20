import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function TripDetail() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5555/trips/${tripId}`)
            .then((res) => res.json())
            .then((data) => setTrip(data))
            .catch((error) => console.error('Error fetching trip details:', error));
    }, [tripId]);

    if (!trip) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{trip.name}</h1>
            <p><strong>Start Date:</strong> {trip.start_date}</p>
            <p><strong>End Date:</strong> {trip.end_date}</p>
            <p><strong>Description:</strong> {trip.description}</p>
        </div>
    );
}

export default TripDetail;
