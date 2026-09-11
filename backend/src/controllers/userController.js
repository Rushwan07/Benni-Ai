const AppError = require("../utils/appError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const User = require("../models/userModel");

exports.createUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

        if (!name, !email, !password) {
            res.status(400).json({
                status: 'INVALID_CREDENTIALS',
                message: 'User with this email already exists'
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                code: 'INVALID_CREDENTIALS',
                message: 'User with this email already exists'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, password: hashedPassword
        });

        newUser.save();

        res.status(200).json({
            status: "success",
            message: "User created"
        });
    } catch (err) {
        console.error("Error details:", err);
        res
            .status(400)
            .json({ message: "An error occurred while creating the user", error: err.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                code: "INVALID_CREDENTIALS",
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                code: "INVALID_CREDENTIALS",
                message: "Invalid email or password"
            });
        }

        // 4. Create JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
        );

        // 5. Store JWT in cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 5 * 24 * 60 * 60 * 1000
        });

        // 6. Send response
        return res.status(200).json({
            status: "success",
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error details:", error);

        return res.status(500).json({
            message: "An error occurred while logging in",
            error: error.message
        });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
};

exports.getMe = async (req, res) => {
    try {
        return res.status(200).json({
            status: "success",
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        console.error("Get Me Error:", error);

        return res.status(500).json({
            status: "error",
            message: "Failed to get user"
        });
    }
};