const express = require('express');
const authController = require("../controllers/auth.controller")
const multer = require('multer');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', authController.getCurrentSession)
router.get('/user/profile', authMiddleware.authUserMiddleware, authController.getUserProfile)

// user auth APIs
router.post('/user/register', upload.single('profilePicture'), authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)



// food partner auth APIs
router.post('/food-partner/register', upload.single('profilePicture'), authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.get('/food-partner/logout', authController.logoutFoodPartner)



module.exports = router;