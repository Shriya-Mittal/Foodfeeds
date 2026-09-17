import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import API_BASE_URL from '../../config/api';

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/food`, { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems.map((item) => ({ ...item, isLiked: false, isSaved: false })))
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post(`${API_BASE_URL}/api/food/like`, { foodId: item._id }, {withCredentials: true})

        if(response.data.liked){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, isLiked: true, likeCount: (v.likeCount ?? 0) + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, isLiked: false, likeCount: Math.max(0, v.likeCount - 1) } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post(`${API_BASE_URL}/api/food/save`, { foodId: item._id }, { withCredentials: true })
        
        if(response.data.saved){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, isSaved: true, savesCount: (v.savesCount ?? 0) + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, isSaved: false, savesCount: Math.max(0, v.savesCount - 1) } : v))
        }
    }

    function commentAdded(item, comment, count) {
        setVideos((prev) => prev.map((video) => video._id === item._id
            ? { ...video, commentsCount: count }
            : video
        ));
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            onCommentAdded={commentAdded}
            emptyMessage="No videos available."
        />
    )
}

export default Home