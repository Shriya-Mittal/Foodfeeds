const foodModel = require('../models/food.model');
const storageService = require('../services/storage.service');
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const commentModel = require("../models/comment.model")
const { v4: uuid } = require("uuid")


async function createFood(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "Food video is required" });
    }

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food created successfully",
        food: foodItem
    })

}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})
    const foodItemsWithCounts = await Promise.all(foodItems.map(async (foodItem) => ({
        ...foodItem.toObject(),
        commentsCount: await commentModel.countDocuments({ food: foodItem._id })
    })))
    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: foodItemsWithCounts
    })
}

    async function deleteFood(req, res) {
        const food = await foodModel.findOne({
            _id: req.params.id,
            foodPartner: req.foodPartner._id
        });

        if (!food) {
            return res.status(404).json({ message: "Food video not found" });
        }

        await food.deleteOne();
        res.status(200).json({ message: "Food video deleted successfully" });
    }


async function likeFood(req, res) {
    const { foodId } = req.body;
    const user = req.user;

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(200).json({
            message: "Food unliked successfully",
            liked: false
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "Food liked successfully",
        like,
        liked: true
    })

}

async function saveFood(req, res) {

    const { foodId } = req.body;
    const user = req.user;

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: -1 }
        })

        return res.status(200).json({
            message: "Food unsaved successfully",
            saved: false
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { savesCount: 1 }
    })

    res.status(201).json({
        message: "Food saved successfully",
        save,
        saved: true
    })

}

async function getSaveFood(req, res) {

    const user = req.user;

    const savedFoods = await saveModel.find({ user: user._id }).populate('food');

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    const savedFoodsWithCounts = await Promise.all(savedFoods.map(async (savedFood) => ({
        ...savedFood.toObject(),
        food: {
            ...savedFood.food.toObject(),
            commentsCount: await commentModel.countDocuments({ food: savedFood.food._id })
        }
    })));

    res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods: savedFoodsWithCounts
    });

}


module.exports = {
    createFood,
    getFoodItems,
        deleteFood,
    likeFood,
    saveFood,
    getSaveFood
}