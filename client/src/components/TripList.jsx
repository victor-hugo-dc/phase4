import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TripList() {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5555/trips')
            .then((res) => res.json())
            .then((data) => setTrips(data))
            .catch((error) => console.error('Error fetching trips:', error));
    }, []);

    return (
        <div>
            <h1>Trip List</h1>
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <h3>
                            <Link to={`/trip/${trip.id}`}>{trip.name}</Link>
                        </h3>
                        <p>{trip.start_date} to {trip.end_date}</p>
                        <p>{trip.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TripList;
