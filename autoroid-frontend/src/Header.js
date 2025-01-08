import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom'; // Assuming you're using React Router

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/#" className="logo-link">
                    <img src="/images/logo.png" alt="Autoroid Logo" className="logo" />
                    <h1>Autoroid</h1>
                </Link>
            </div>

            <nav>
                <a href="#" className="sell-car">Verkaufe Dein Auto</a>
            </nav>

            <div className="search-bar">
                <i className="search-icon"></i>
                <input type="text" placeholder="Suche" />
            </div>

            <div className="auth-buttons">
                <button className="sign-in-btn">Einloggen</button>
            </div>
        </header>
    );
};

export default Header;
