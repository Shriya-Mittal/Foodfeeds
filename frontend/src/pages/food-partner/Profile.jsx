import React, { useState, useEffect } from 'react'
import '../../styles/profile.css'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../../config/api';
import LogoutButton from '../../components/LogoutButton';


const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])

    const handleDelete = async (foodId) => {
        if (!window.confirm('Delete this food video?')) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/food/${foodId}`, { withCredentials: true });
            setVideos((currentVideos) => currentVideos.filter((video) => video._id !== foodId));
        } catch {
            window.alert('Video could not be deleted.');
        }
    }

    useEffect(() => {
        const profilePath = id ? `/api/food-partner/${id}` : '/api/food-partner/me';
        axios.get(`${API_BASE_URL}${profilePath}`, { withCredentials: true })
            .then(response => {
                setProfile(response.data.foodPartner)
                setVideos(response.data.foodPartner.foodItems || [])
            })
            .catch(() => {
                setProfile(null)
                setVideos([])
            })
    }, [ id ])


    return (
        <main className="profile-page">
            <div className="profile-page-actions"><LogoutButton /></div>
            <section className="profile-header">
                <div className="profile-meta">

                    {profile?.profilePicture ? (
                        <img className="profile-avatar" src={profile.profilePicture} alt={`${profile.name} profile`} />
                    ) : (
                        <div className="profile-avatar profile-avatar-fallback" aria-label="Profile picture placeholder">
                            {profile?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    )}

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {videos.map((v) => (
                    <div key={v._id} className="profile-grid-item">
                        {/* Placeholder tile; replace with <video> or <img> as needed */}


                        <video
                            className="profile-grid-video"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            src={v.video} muted controls></video>
                        {!id && <button className="delete-video-button" type="button" onClick={() => handleDelete(v._id)}>Delete video</button>}


                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile