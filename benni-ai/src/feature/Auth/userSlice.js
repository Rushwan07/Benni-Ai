import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getMe = createAsyncThunk(
    "user/getMe",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                BASE_URL + "/users/me",
                {
                    withCredentials: true
                }
            );


            return res.data.user;

        } catch (error) {
            console.log("ME ERROR:", error.response?.data || error.message);

            return rejectWithValue(
                error.response?.data?.message || "Not authenticated"
            );
        }
    }
);

const initialState = {};

const userSlice = createSlice({
    name: "user",

    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.user = action.payload;
        });
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;