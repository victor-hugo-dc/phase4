import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
import PlacesList from './components/PlacesList';

const App = () => {
  const [trips, setTrips] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tripsResponse = await fetch('http://localhost:5555/trips');
      const tripsData = await tripsResponse.json();
      setTrips(tripsData);

      const placesResponse = await fetch('http://localhost:5555/places');
      const placesData = await placesResponse.json();
      setPlaces(placesData);
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/trips" element={<TripList trips={trips}  places={places} setTrips={setTrips} />} />
        <Route path="/trips/new" element={<TripForm setTrips={setTrips} />} />
        <Route path="/places" element={<PlacesList places={places} setPlaces={setPlaces} />} />
      </Routes>
    </>
  );
};

export default App;