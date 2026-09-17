import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import UserRegister from '../pages/auth/UserRegister';
import ChooseRegister from '../pages/auth/ChooseRegister';
import UserLogin from '../pages/auth/UserLogin';
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister';
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin';
import Home from '../pages/general/Home';
import Saved from '../pages/general/Saved';
import BottomNav from '../components/BottomNav';
import CreateFood from '../pages/food-partner/CreateFood';
import Profile from '../pages/food-partner/Profile';
import OrderFood from '../pages/general/OrderFood';
import Payment from '../pages/general/Payment';
import FoodPartnerHome from '../pages/general/FoodPartnerHome';
import UserProfile from '../pages/general/UserProfile';
import API_BASE_URL from '../config/api';

const SessionRoute = ({ role, children }) => {
    const [session, setSession] = useState({ loading: true, role: null });

    useEffect(() => {
        let active = true;
        axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true })
            .then((response) => {
                if (active) {
                    localStorage.setItem('zomafeeds-role', response.data.role);
                    setSession({ loading: false, role: response.data.role });
                }
            })
            .catch(() => {
                localStorage.removeItem('zomafeeds-role');
                if (active) setSession({ loading: false, role: null });
            });

        return () => { active = false; };
    }, []);

    if (session.loading) return <div className="auth-session-loading">Checking session...</div>;
    if (!session.role) return <Navigate to="/register" replace />;
    if (session.role !== role) {
        return <Navigate to={session.role === 'food-partner' ? '/create-food' : '/reels'} replace />;
    }
    return children;
};

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<ChooseRegister />} />
                <Route path="/user/register" element={<UserRegister />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
                <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
                <Route path="/home" element={<SessionRoute role="user"><FoodPartnerHome /><BottomNav /></SessionRoute>} />
                <Route path="/reels" element={<SessionRoute role="user"><Home /><BottomNav /></SessionRoute>} />
                <Route path='/'element={<><ChooseRegister/></>}/>
                <Route path="/profile" element={<SessionRoute role="food-partner"><Profile /></SessionRoute>} />
                <Route path="/saved" element={<SessionRoute role="user"><Saved /><BottomNav /></SessionRoute>} />
                <Route path="/user-profile" element={<SessionRoute role="user"><><UserProfile /><BottomNav /></></SessionRoute>} />
                <Route path="/create-food" element={<SessionRoute role="food-partner"><CreateFood /></SessionRoute>} />
                <Route path="/food-partner/:id" element={<SessionRoute role="user"><><Profile /><BottomNav /></></SessionRoute>} />
                <Route path="/order/:foodId" element={<SessionRoute role="user"><OrderFood /></SessionRoute>} />
                <Route path="/payment/:orderId" element={<SessionRoute role="user"><Payment /></SessionRoute>} />
            </Routes>
        </Router>
    )
}

export default AppRoutes