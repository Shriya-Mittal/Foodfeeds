const express = require("express");
const router = express.Router();
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

router.post("/", authUserMiddleware, orderController.createOrder);
router.get("/my", authUserMiddleware, orderController.getMyOrders);
router.get("/:id", authUserMiddleware, orderController.getOrderById);
router.patch("/:id/pay", authUserMiddleware, orderController.payOrder);

module.exports = router;
