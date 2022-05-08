import { configureStore, createSlice } from "@reduxjs/toolkit";

const MY_BLOG_THEME = 'MY_BLOG_THEME';

const DARK = 'DARK';

const LIGHT = 'LIGHT';

const nowTheme = 
    localStorage.getItem(MY_BLOG_THEME);

if(!nowTheme) 
    localStorage.setItem(MY_BLOG_THEME, LIGHT);

const counterSlice = createSlice({
    name: 'themeReducer',
    initialState: {
        value: nowTheme ? false : true
    },
    reducers: {
        changeThemeMode: state => {
            if(state.value) {
                localStorage.setItem(MY_BLOG_THEME, LIGHT);
            } else {
                localStorage.setItem(MY_BLOG_THEME, DARK);
            };
            state.value = !state.value;
        }
    }
});

export const { changeThemeMode } = counterSlice.actions;

export const store = configureStore({
    reducer: counterSlice.reducer
});