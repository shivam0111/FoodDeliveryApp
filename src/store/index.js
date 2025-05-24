import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "../features/language/languageSlice";
import authReducer from "../features/auth/authSlice";
// configureStore
export const store = configureStore({
    reducer: {
        language: languageReducer,
        auth: authReducer
    },
});