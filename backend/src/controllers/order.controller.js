const orderModel = require("../models/order.model");
const foodModel = require("../models/food.model");

async function createOrder(req, res) {
  try {
    const { foodId, quantity, address } = req.body;

    if (!foodId || !address) {
      return res.status(400).json({ message: "food id aur address zaroori hain" });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food item nahi mila" });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;

    // NOTE: agar aapke food.model.js mein "price" field nahi hai to yahan default price use ho raha hai.
    // Real app ke liye food.model.js mein price field add karna better hoga.
    const price = food.price || 100;

    const order = await orderModel.create({
      user: req.user._id,
      items: [
        {
          food: food._id,
          name: food.name,
          price,
          quantity: qty,
        },
      ],
      totalAmount: price * qty,
      address,
      status: "pending",
    });

    res.status(201).json({
      message: "Order create ho gaya, ab payment karo",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Order create karne mein error", error: err.message });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Orders fetch karne mein error", error: err.message });
  }
}

async function getOrderById(req, res) {
  try {
    const { id } = req.params;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye order aapka nahi hai" });
    }

    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ message: "Order fetch karne mein error", error: err.message });
  }
}

// DUMMY PAYMENT — koi real payment gateway (Razorpay/Stripe) nahi hai,
// sirf order ka status "paid" mein update ho raha hai.
async function payOrder(req, res) {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Ye order aapka nahi hai" });
    }

    order.status = "paid";
    order.paymentMethod = paymentMethod || "dummy-card";
    await order.save();

    res.status(200).json({
      message: "Payment successful (dummy)",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment karne mein error", error: err.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  payOrder,
};
