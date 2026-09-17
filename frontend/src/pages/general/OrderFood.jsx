import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReviewSection from "../../components/ReviewSection";
import CommentSection from "../../components/CommentSection";
import API_BASE_URL from "../../config/api";

function OrderFood() {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Delivery address dalna zaroori hai");
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/orders`,
        { foodId, quantity, address },
        { withCredentials: true }
      );

      // order create hone ke baad seedha payment page pe le jao
      navigate(`/payment/${res.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Order create nahi hua");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-food-page">
      <h2>Order Food</h2>

      <form onSubmit={handleOrder} className="order-form">
        <label>
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <label>
          Delivery Address
          <textarea
            placeholder="Apna pura address likho"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Please wait..." : "Proceed to Payment"}
        </button>
      </form>

      <ReviewSection foodId={foodId} />
      <CommentSection foodId={foodId} />
    </div>
  );
}

export default OrderFood;
