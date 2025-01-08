import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AuctionDetail.css';

const AuctionDetail = () => {
    const { id } = useParams(); // Get the auction ID from the URL parameters
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bigImage, setBigImage] = useState(null);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        // Fetch the auction details and log the response or error for debugging
        axios.get(`http://localhost:8000/api/auctions/${id}/`)
            .then(response => {
                console.log('API Response for Auction Detail:', response.data);
                setAuction(response.data);
                if (response.data.images && response.data.images.length > 0) {
                    setBigImage(`http://localhost:8000${response.data.images[0].image}`);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching auction details:', error);
                setError('Failed to load auction details. Please try again later.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading auction details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!auction) {
        return <div>No auction found.</div>;
    }

    const handleThumbnailClick = (imageUrl) => {
        setBigImage(imageUrl);
    };

    const primaryImageUrl = bigImage || '/images/default-thumbnail.jpg'; // Fallback image

    return (
        <div className="auction-detail-container">
            <h2 className="auction-detail-title">{auction.title}</h2>

            <div className="auction-detail-content">
                {/* Big Image */}
                <div className="auction-detail-big-image">
                    <img src={primaryImageUrl} alt={auction.title} />
                </div>

                {/* Thumbnails */}
                <div className="auction-detail-thumbnails">
                    {auction.images && auction.images.length > 1 ? (
                        auction.images.slice(1, 5).map((img, index) => (
                            <img
                                key={index}
                                src={`http://localhost:8000${img.image}`}
                                alt={`Thumbnail ${index + 1}`}
                                className="auction-detail-thumbnail"
                                onClick={() => handleThumbnailClick(`http://localhost:8000${img.image}`)}
                            />
                        ))
                    ) : (
                        <p>No additional images available for this auction.</p>
                    )}
                </div>

                {/* View All Images Link */}
                {auction.images && auction.images.length > 5 && (
                    <div className="auction-detail-view-all">
                        <button onClick={() => setShowGallery(true)}>View All Images</button>
                    </div>
                )}

                {/* Gallery Modal */}
                {showGallery && (
                    <div className="auction-detail-gallery-modal">
                        <button className="close" onClick={() => setShowGallery(false)}>×</button>
                        {auction.images.map((img, index) => (
                            <img
                                key={index}
                                src={`http://localhost:8000${img.image}`}
                                alt={`Gallery Image ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Auction Information */}
                <div className="auction-detail-info">
                    <p><strong>Description:</strong> {auction.description}</p>
                    <p><strong>Starting bid:</strong> {auction.starting_bid} &euro;</p>
                    <p><strong>Current bid:</strong> {auction.current_bid} &euro;</p>
                    <p><strong>Time remaining:</strong> {formatTime(auction.time_remaining)}</p>
                </div>
            </div>
        </div>
    );
};

// Helper function to format the remaining time
const formatTime = (timeString) => {
    if (!timeString) return "No time remaining";
    const parts = timeString.split(", ");
    if (parts.length === 2) {
        return `${parts[0]} and ${parts[1]}`;
    }
    return timeString;
};

export default AuctionDetail;
