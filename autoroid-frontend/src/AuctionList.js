import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AuctionList.css';

const AuctionList = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/auctions/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched auctions data:', data);
                setCars(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load auctions:', err);
                setError('Failed to load auctions. Please try again later.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading auctions...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (cars.length === 0) {
        return <div>No auctions available</div>;
    }

    return (
        <div className="auction-list-container">
            {cars.map((car) => (
                <AuctionDetailCard key={car.id} car={car} />
            ))}
        </div>
    );
};

const AuctionDetailCard = ({ car }) => {
    const [timeRemaining, setTimeRemaining] = useState(car.time_remaining);
    const [barColor, setBarColor] = useState('#87CEEB');
    const [barWidth, setBarWidth] = useState('100%');
    const [displayTextTop, setDisplayTextTop] = useState('');
    const [displayTextBottom, setDisplayTextBottom] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDate = new Date(car.end_date);
            const now = new Date();
            const difference = endDate - now;

            if (difference <= 0) {
                setBarWidth('100%');
                setBarColor('#90ee90');
                setDisplayTextTop('Auction Ended');
                setDisplayTextBottom(`Sold to: \u20AC ${car.current_bid}`);
                return "Auction Ended";
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                const milliseconds = difference % 1000;

                if (days > 0 || hours > 0 || minutes >= 1) {
                    setBarColor('#87CEEB');
                    setBarWidth('100%');
                    setDisplayTextTop(`Remaining Time: ${days > 0 ? `${days} Days` : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}`);
                    setDisplayTextBottom(`Current bid: \u20AC ${car.current_bid}`);
                } else {
                    setBarColor('#d9534f');
                    const smoothWidth = ((seconds * 1000 + milliseconds) / 60000) * 100;
                    setBarWidth(`${smoothWidth}%`);
                    setDisplayTextTop(`Remaining Time: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
                    setDisplayTextBottom(`Current bid: \u20AC ${car.current_bid}`);
                }

                return `${days} Days`;
            }
        };

        const timerId = setInterval(() => {
            setTimeRemaining(calculateTimeLeft());
        }, 200);

        return () => clearInterval(timerId);
    }, [car.end_date]);

    return (
        <Link to={`/auction/${car.id}`} className="auction-link">
            <div className="auction-card">
                {car.image && <img src={`http://localhost:8000${car.image}`} alt={car.title} className="auction-image" />}
                <h2 className="auction-title">{car.title}</h2>
                <div className="info-bar" style={{ backgroundColor: barColor, color: '#000' }}>
                    <div className="info-bar-text-top">{displayTextTop}</div>
                    <div className="info-bar-text-bottom">{displayTextBottom}</div>
                    <div className="info-bar-progress" style={{ width: barWidth }}></div>
                </div>
            </div>
        </Link>
    );
};

export default AuctionList;
