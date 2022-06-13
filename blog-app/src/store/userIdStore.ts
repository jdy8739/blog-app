import { createSlice } from '@reduxjs/toolkit';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../util/cookie';

const initialUserInfo = getCookie(MY_BLOG_COOKIE_NAME);

const userIdSlice = createSlice({
	name: 'userIdReducer',
	initialState: {
		id: initialUserInfo ? initialUserInfo[0] : '',
	},
	reducers: {
		changeUserId: (state, action: { payload: string }) => {
			state.id = action.payload;
		},
	},
});

export const { changeUserId } = userIdSlice.actions;

export default userIdSlice.reducer;
