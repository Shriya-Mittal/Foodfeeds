const express = require('express');
const foodPartnerController = require("../controllers/food-partner.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me",
    authMiddleware.authFoodPartnerMiddleware,
    foodPartnerController.getMyFoodPartnerProfile)

/* GET /api/food-partner [protected user route] */
router.get("/",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartners)


/* /api/food-partner/:id */
router.get("/:id",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById)

module.exports = router;