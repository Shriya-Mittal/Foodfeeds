import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";

function CommentSection({ foodId, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [foodId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/comments/${foodId}`, {
        withCredentials: true,
      });
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Comments fetch nahi hue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/comments`,
        { food: foodId, text },
        { withCredentials: true }
      );
      const nextComments = [res.data.comment, ...comments];
      setComments(nextComments);
      onCommentAdded?.(res.data.comment, nextComments.length);
      setText("");
    } catch (err) {
      console.error("Comment add nahi hua", err);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-section-heading">
        <h4>Comments</h4>
        {onClose && <button type="button" onClick={onClose} aria-label="Close comments">&times;</button>}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Comment likho..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="empty-text">There is no comment</p>
      ) : (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c._id}>
              <strong>{c.user?.fullName || "User"}</strong>: {c.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentSection;
