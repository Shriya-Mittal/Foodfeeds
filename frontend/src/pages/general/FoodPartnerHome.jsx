import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/partner-home.css';
import API_BASE_URL from '../../config/api';

const FoodPartnerHome = () => {
    const [ partners, setPartners ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/food-partner`, { withCredentials: true })
            .then((response) => setPartners(response.data.foodPartners))
            .catch(() => setError('Food partners could not be loaded.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="partner-home-page">
            <header className="partner-home-header">
                <p className="partner-home-kicker">Discover local kitchens</p>
                <h1>Food partners</h1>
                <p>Find a kitchen, then explore its latest food videos.</p>
            </header>

            {loading && <p className="partner-home-status">Loading food partners...</p>}
            {error && <p className="partner-home-status" role="alert">{error}</p>}
            {!loading && !error && partners.length === 0 && (
                <p className="partner-home-status">No food partners are available yet.</p>
            )}

            <section className="partner-list" aria-label="Food partners">
                {partners.map((partner) => (
                    <Link
                        key={partner._id}
                        to={`/food-partner/${partner._id}`}
                        className="partner-card"
                    >
                        {partner.profilePicture ? (
                            <img className="partner-card-avatar" src={partner.profilePicture} alt="" />
                        ) : (
                            <div className="partner-card-avatar" aria-hidden="true">
                                {partner.name?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <div className="partner-card-content">
                            <h2>{partner.name}</h2>
                            <p>{partner.address}</p>
                            <span>View food reels</span>
                        </div>
                        <span className="partner-card-arrow" aria-hidden="true">&rarr;</span>
                    </Link>
                ))}
            </section>
        </main>
    );
};

export default FoodPartnerHome;