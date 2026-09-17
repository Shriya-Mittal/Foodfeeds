const userModel = require("../models/user.model")
const foodPartnerModel = require("../models/foodpartner.model")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authCookieOptions = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
};

async function getCurrentSession(req, res) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password');

        if (user) {
            return res.status(200).json({ role: 'user', user });
        }

        const foodPartner = await foodPartnerModel.findById(decoded.id).select('-password');

        if (foodPartner) {
            return res.status(200).json({ role: 'food-partner', foodPartner });
        }

        return res.status(401).json({ message: "Invalid session" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid session" });
    }
}

async function getUserProfile(req, res) {
    const user = await userModel.findById(req.user._id).select('-password');
    res.status(200).json({ user });
}

async function registerUser(req, res) {

    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = '';
    if (req.file) {
        const storageService = require('../services/storage.service');
        const uploadResult = await storageService.uploadFile(req.file.buffer, `user-profile-${Date.now()}`);
        profilePicture = uploadResult.url;
    }

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
        profilePicture
    })

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, authCookieOptions)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePicture: user.profilePicture
        }
    })

}

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, authCookieOptions)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token", authCookieOptions);
    res.status(200).json({
        message: "User logged out successfully"
    });
}


async function registerFoodPartner(req, res) {

    const { name, email, password, phone, address, contactName } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food partner account already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = '';
    if (req.file) {
        const storageService = require('../services/storage.service');
        const uploadResult = await storageService.uploadFile(req.file.buffer, `profile-${Date.now()}`);
        profilePicture = uploadResult.url;
    }

    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName,
        profilePicture
    })

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, authCookieOptions)

    res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone,
            profilePicture: foodPartner.profilePicture
        }
    })

}

async function loginFoodPartner(req, res) {

    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({
        email
    })

    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, authCookieOptions)

    res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            profilePicture: foodPartner.profilePicture
        }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token", authCookieOptions);
    res.status(200).json({
        message: "Food partner logged out successfully"
    });
}

module.exports = {
    getCurrentSession,
    getUserProfile,
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}