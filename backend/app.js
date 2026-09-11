const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const userRouter = require("./src/routes/userRouter");
const docRouter = require("./src/routes/docRouter");
const aiRouter = require("./src/routes/aiRouter");

const app = express();


// ===============================
// BODY PARSER
// ===============================

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());


// ===============================
// CORS
// ===============================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://benni-ai.vercel.app"
        ],
        credentials: true
    })
);


// ===============================
// LOGGER
// ===============================

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


// ===============================
// STATIC FILES
// ===============================

app.use(express.static(`${__dirname}/public`));


// ===============================
// REQUEST TIME
// ===============================

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


// ===============================
// ROOT ROUTE
// ===============================

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running...",
    });
});


// ===============================
// ROUTES
// ===============================

app.use("/api/v1/users", userRouter);
app.use("/api/v1/doc", docRouter);
app.use("/api/v1/ai", aiRouter);


app.use((req, res, next) => {
    next(
        new AppError(
            `Can't find ${req.originalUrl} on this server!`,
            404
        )
    );
});


// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use(globalErrorHandler);


module.exports = app;