import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TripList from './components/TripList';
import TripForm from './components/TripForm';
// import TripDetail from './components/TripDetail';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/new" element={<TripForm />} />
        {/* <Route path="/trip/:tripId" element={<TripDetail />} /> */}
      </Routes>
    </>
  );
};

export default App;
