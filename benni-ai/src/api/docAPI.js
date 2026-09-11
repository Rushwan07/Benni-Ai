const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

export const getDocuments = async () => {
    try {

        const res = await axios.get(
            BASE_URL + "/doc/documnets",
            {
                withCredentials: true,
            },
        );

        if (res.data.status === "success") {

            return res;
        }
    } catch (error) {
        console.error("Error fetching Docs:", error);
    }
};

export const createDocument = async (data) => {

    try {
        const res = await axios.post(
            BASE_URL + "/doc/create",
            data,
            {
                withCredentials: true
            }
        );

        return res.data;

    } catch (error) {
        console.log(
            "Create document error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export const deleteDocument = async (id) => {
    try {
        const res = await axios.delete(BASE_URL + "/doc/delete/" + id,
            {
                withCredentials: true
            }
        )
        return res.data;
    } catch (error) {
        console.log(
            "Delete document error:",
            error.response?.data || error.message
        );

        throw error;

    }
}

export const saveDocument = async (id, title, content) => {
    try {
        const res = await axios.patch(
            BASE_URL + `/doc/update/${id}`,
            {
                title,
                content
            },
            {
                withCredentials: true
            }
        );

        if (res.data.status === "success") {
            return res.data;
        }

    } catch (error) {
        console.log(
            "Save document error:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const res = await axios.post(
            BASE_URL + "/users/logout",
            {},
            {
                withCredentials: true,
            }
        );

        return res.data;

    } catch (error) {
        console.log(
            "Error while logout:",
            error.response?.data || error.message
        );

        throw error;
    }
};


export const useBennie = async (prompt) => {
    try {
        const res = await axios.post(
            BASE_URL + "/ai/generate",
            { prompt },
            { withCredentials: true }
        );

        return res.data;
    } catch (error) {
        console.log(
            "Bennie generation error:",
            error.response?.data || error.message
        );

        throw error;
    }
};