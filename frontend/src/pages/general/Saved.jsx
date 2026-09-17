import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'
import API_BASE_URL from '../../config/api';

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/food/save`, { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                    isSaved: true,
                    isLiked: false,
                }))
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            await axios.post(`${API_BASE_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: Math.max(0, (v.savesCount ?? 1) - 1) } : v))
        } catch {
            // noop
        }
    }

    const commentAdded = (item, comment, count) => {
        setVideos((prev) => prev.map((video) => video._id === item._id
            ? { ...video, commentsCount: count }
            : video
        ));
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            onCommentAdded={commentAdded}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved
