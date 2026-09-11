import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../feature/Auth/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});