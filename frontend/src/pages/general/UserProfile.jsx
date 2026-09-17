import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/user-profile.css';
import API_BASE_URL from '../../config/api';
import LogoutButton from '../../components/LogoutButton';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all([
            axios.get(`${API_BASE_URL}/api/auth/user/profile`, { withCredentials: true }),
            axios.get(`${API_BASE_URL}/api/orders/my`, { withCredentials: true })
        ])
            .then(([profileResponse, ordersResponse]) => {
                setUser(profileResponse.data.user);
                setOrders(ordersResponse.data.orders || []);
            })
            .catch(() => setError('Profile details could not be loaded.'));
    }, []);

    return (
        <main className="user-profile-page">
            <header className="user-profile-header">
                <div>
                    <p className="user-profile-kicker">Your account</p>
                    <h1>Profile</h1>
                </div>
                <LogoutButton />
            </header>

            {error && <p className="user-profile-status" role="alert">{error}</p>}

            <section className="user-identity" aria-label="Account details">
                {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={`${user.fullName} profile`} className="user-profile-avatar" />
                ) : (
                    <div className="user-profile-avatar user-profile-avatar-fallback" aria-hidden="true">
                        {user?.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                )}
                <div>
                    <h2>{user?.fullName || 'Loading...'}</h2>
                    <p>{user?.email}</p>
                </div>
            </section>

            <section className="history-section" aria-labelledby="order-history-title">
                <div className="section-heading">
                    <h2 id="order-history-title">Order history</h2>
                    <span>{orders.length} orders</span>
                </div>
                {orders.length === 0 ? (
                    <p className="user-profile-status">No orders yet.</p>
                ) : (
                    <div className="order-history-list">
                        {orders.map((order) => (
                            <article className="order-history-card" key={order._id}>
                                <div>
                                    <h3>{order.items?.map((item) => item.name).join(', ')}</h3>
                                    <p>{new Date(order.createdAt).toLocaleDateString()} · {order.paymentMethod || 'Payment pending'}</p>
                                </div>
                                <div className="order-history-total">
                                    <strong>₹{order.totalAmount}</strong>
                                    <span className={`order-status order-status-${order.status}`}>{order.status}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default UserProfile;