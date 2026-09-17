import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const LogoutButton = () => {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();

    const logout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        const role = localStorage.getItem('zomafeeds-role');
        const endpoint = role === 'food-partner' ? 'food-partner' : 'user';

        try {
            await axios.get(`${API_BASE_URL}/api/auth/${endpoint}/logout`, { withCredentials: true });
        } finally {
            localStorage.removeItem('zomafeeds-role');
            navigate('/register', { replace: true });
            setLoggingOut(false);
        }
    };

    return (
        <button type="button" className="logout-button" onClick={logout} disabled={loggingOut}>
            {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
    );
};

export default LogoutButton;