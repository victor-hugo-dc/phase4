import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TripList from './components/TripList';
import CreateTrip from './components/CreateTrip';
import TripDetail from './components/TripDetail';  // Import the TripDetail component

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Trip List</Link>
          </li>
          <li>
            <Link to="/create-trip">Create Trip</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<TripList />} />
        <Route path="/create-trip" element={<CreateTrip />} />
        <Route path="/trip/:tripId" element={<TripDetail />} />  {/* Add the route for TripDetail */}
      </Routes>
    </Router>
  );
}

export default App;
