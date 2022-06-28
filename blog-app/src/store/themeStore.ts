import { createSlice } from '@reduxjs/toolkit';

const MY_BLOG_THEME = 'MY_BLOG_THEME';

const DARK = 'DARK';

const LIGHT = 'LIGHT';

const nowTheme = localStorage.getItem(MY_BLOG_THEME);

if (!nowTheme) localStorage.setItem(MY_BLOG_THEME, LIGHT);

const counterSlice = createSlice({
	name: 'themeReducer',
	initialState: {
		// eslint-disable-next-line no-nested-ternary
		value: nowTheme ? (nowTheme === DARK ? false : true) : true,
	},
	reducers: {
		changeThemeMode: state => {
			if (state.value) {
				localStorage.setItem(MY_BLOG_THEME, DARK);
			} else {
				localStorage.setItem(MY_BLOG_THEME, LIGHT);
			}
			state.value = !state.value;
		},
	},
});

export const { changeThemeMode } = counterSlice.actions;

export default counterSlice.reducer;
