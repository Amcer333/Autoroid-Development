import React from 'react';
import './Filters.css';

const Filters = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Array(currentYear - 1950 + 1), (v, i) => i + 1950); // Generate years from 1950 to current year

    return (
        <div className="filters">
            <select name="year">
                <option value="">Years</option>
                {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <select name="transmission">
                <option value="">Transmission</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
            </select>
            <select name="bodyStyle">
                <option value="">Body Style</option>
                <option value="Limousine">Limousine</option>
                <option value="SUV">SUV</option>
                <option value="Flie&szlig;heck">Flie&szlig;heck</option>
                <option value="Kombi">Kombi</option>
                <option value="CUV">CUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Van">Van</option>
                <option value="Cabrio">Cabrio</option>
            </select>
        </div>
    );
};

export default Filters;
