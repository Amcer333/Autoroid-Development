import React, { useEffect, useState } from 'react';
import Header from './Header';
import Filters from './Filters';
import AuctionList from './AuctionList';
import AuctionDetail from './AuctionDetail';
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
    // State to store auction data
    const [cars, setCars] = useState([]);

    // Fetch auction data from Django backend
    useEffect(() => {
        axios.get('/api/auctions/')
            .then(response => {
                setCars(response.data);
            })
            .catch(error => {
                console.error('Error fetching auction data:', error);
                // Display a message to the user if there's an error
                alert('Failed to load auctions. Please try again later.');
            });
    }, []); // Empty dependency array means this runs once after the component mounts

    return (
        <Router>
            <div className="App">
                <Header />
                <Filters />
                <Routes>
                    {/* Route for the auction list */}
                    <Route path="/" element={<AuctionList cars={cars} />} />

                    {/* Route for auction details */}
                    <Route path="/auction/:id" element={<AuctionDetail />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
