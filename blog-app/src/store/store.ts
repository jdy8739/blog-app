import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './themeStore';
import userIdReducer from './userIdStore';

export const store = configureStore({
	reducer: {
		modeChanger: modeReducer,
		userIdChanger: userIdReducer,
	},
});
