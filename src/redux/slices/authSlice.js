

import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Function to get the initial authentication state from localStorage
const getInitialAuthState = () => {
    try {
        const storedToken = localStorage.getItem('token'); // Try to get token from localStorage
        if (storedToken) {
            const decoded = jwtDecode(storedToken);

            // Optional: Check for token expiration
            // If the token has an 'exp' (expiration) claim and it's in the past,
            // treat it as expired and don't use it.
            const currentTime = Date.now() / 1000; // Convert to seconds
            if (decoded.exp && decoded.exp < currentTime) {
                console.warn("Stored token is expired.");
                localStorage.removeItem('token'); // Clear expired token
                return {
                    token: null,
                    role: null,
                    isAthunticated: false
                };
            }

            // If token is valid, use it to set initial state
            return {
                token: storedToken,
                role: decoded.role,
                isAthunticated: true
            };
        }
    } catch (error) {
        console.error("Error decoding token from localStorage or token is invalid:", error);
        // If there's an error decoding (e.g., malformed token), clear it
        localStorage.removeItem('token');
    }
    // If no token or an error occurred, return default unauthenticated state
    return {
        token: null,
        role: null,
        isAthunticated: false
    };
};

const initialState = getInitialAuthState(); // Set initial state using the function

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const token = action.payload;
            const decoded = jwtDecode(token);
            console.log("decoded", decoded);

            state.token = token;
            state.role = decoded.role;
            state.isAthunticated = true;

            // Store the token in localStorage upon successful login
            localStorage.setItem('token', token);
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
            state.isAthunticated = false;

            // Remove the token from localStorage upon logout
            localStorage.removeItem('token');
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;