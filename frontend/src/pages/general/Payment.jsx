import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [method, setMethod] = useState("dummy-card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        withCredentials: true,
      });
      setOrder(res.data.order);
    } catch (err) {
      console.error("Order fetch nahi hua", err);
    }
  };

  const handlePay = async () => {
    setProcessing(true);
    try {
      // Ye asli payment gateway (Razorpay/Stripe) nahi hai — sirf 1.5 second ka
      // dummy "processing" simulation hai, taaki UI real jaisa feel de.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await axios.patch(
        `${API_BASE_URL}/api/orders/${orderId}/pay`,
        { paymentMethod: method },
        { withCredentials: true }
      );

      setSuccess(true);
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      console.error("Payment fail ho gaya", err);
    } finally {
      setProcessing(false);
    }
  };

  if (!order) return <p>Loading order...</p>;

  if (success) {
    return (
      <div className="payment-page success">
        <h2>✅ Payment Successful!</h2>
        <p>Aapka order confirm ho gaya hai. Home page pe le ja rahe hain...</p>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h2>Payment (Dummy)</h2>

      <div className="order-summary">
        <h4>Order Summary</h4>
        {order.items.map((item, i) => (
          <p key={i}>
            {item.name} x {item.quantity} — ₹{item.price * item.quantity}
          </p>
        ))}
        <p className="total">Total: ₹{order.totalAmount}</p>
      </div>

      <div className="payment-method">
        <label>
          <input
            type="radio"
            name="method"
            value="dummy-card"
            checked={method === "dummy-card"}
            onChange={(e) => setMethod(e.target.value)}
          />
          Card (Dummy)
        </label>
        <label>
          <input
            type="radio"
            name="method"
            value="dummy-upi"
            checked={method === "dummy-upi"}
            onChange={(e) => setMethod(e.target.value)}
          />
          UPI (Dummy)
        </label>
        <label>
          <input
            type="radio"
            name="method"
            value="cod"
            checked={method === "cod"}
            onChange={(e) => setMethod(e.target.value)}
          />
          Cash on Delivery
        </label>
      </div>

      <button onClick={handlePay} disabled={processing}>
        {processing ? "Processing..." : `Pay ₹${order.totalAmount}`}
      </button>

      <p className="dummy-note">⚠️ Ye ek dummy payment page hai, koi real transaction nahi hoga.</p>
    </div>
  );
}

export default Payment;
