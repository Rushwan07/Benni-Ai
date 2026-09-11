const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.protect = async (req, res, next) => {
    try {

        const token = req.cookies.token;


        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "User no longer exists"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("AUTH ERROR:", error);

        return res.status(401).json({
            status: "fail",
            message: "Invalid or expired token"
        });
    }
};