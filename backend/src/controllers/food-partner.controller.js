const foodPartnerModel = require('../models/foodpartner.model');
const foodModel = require('../models/food.model');

async function getMyFoodPartnerProfile(req, res) {
    const foodItems = await foodModel.find({ foodPartner: req.foodPartner._id }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...req.foodPartner.toObject(),
            foodItems
        }
    });
}

async function getFoodPartners(req, res) {
    const foodPartners = await foodPartnerModel
        .find({}, 'name address contactName profilePicture')
        .sort({ name: 1 });

    res.status(200).json({
        message: "Food partners retrieved successfully",
        foodPartners
    });
}

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await foodModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "Food partner not found" });
    }

    res.status(200).json({
        message: "Food partner retrieved successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner
        }

    });
}

module.exports = {
    getMyFoodPartnerProfile,
    getFoodPartners,
    getFoodPartnerById
};