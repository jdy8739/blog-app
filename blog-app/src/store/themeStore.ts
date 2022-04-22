import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'themeReducer',
    initialState: {
        value: false
    },
    reducers: {
        changeThemeMode: state => { state.value = !state.value }
    }
});

export const { changeThemeMode } = counterSlice.actions;

export const store = configureStore({
    reducer: counterSlice.reducer
});