import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function ReviewSection({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [foodId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews/${foodId}`, {
        withCredentials: true,
      });
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      console.error("Reviews fetch nahi hue", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/reviews`,
        { food: foodId, rating, text },
        { withCredentials: true }
      );
      setText("");
      fetchReviews();
    } catch (err) {
      console.error("Review add nahi hua", err);
    }
  };

  return (
    <div className="review-section">
      <h4>
        Reviews ({averageRating} ⭐ · {reviews.length} reviews)
      </h4>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="star-picker">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              className={n <= rating ? "star filled" : "star"}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Apna review likho..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Submit Review</button>
      </form>

      <ul className="review-list">
        {reviews.map((r) => (
          <li key={r._id}>
            <strong>{r.user?.fullName?.firstName || "User"}</strong> — {r.rating}⭐
            {r.text && <p>{r.text}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReviewSection;
