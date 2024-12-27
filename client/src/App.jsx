import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import TripList from './components/TripList';
import TripForm from './components/TripForm';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<TripList />} />
        <Route path="/trips/new" element={<TripForm />} />
      </Routes>
    </>
  );
};

export default App;
