import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { changeThemeMode, store } from '../store/themeStore';
import { getCookie, MY_BLOG_COOKIE_NAME, removeCookie } from '../util/cookie';

const Nav = styled.nav`
	width: 100vw;
	height: 52px;
	background-color: ${props => props.theme.accentColor};
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px 42px;
	box-sizing: border-box;
	position: fixed;
	top: 0;
	z-index: 99;
`;

const NavElem = styled.p`
	padding: 12px;
	font-size: 13px;
	cursor: pointer;
	&:hover {
		color: ${props => props.theme.backgroundColor};
	}
`;

const ModeButton = styled.div`
	background-color: transparent;
	cursor: pointer;
	color: ${props => props.theme.fontColor};
	border: 1px solid ${props => props.theme.fontColor};
	padding: 3px;
	border-radius: 8px;
	width: 30px;
	height: 12px;
	position: relative;
`;

const ModeBallDark = styled(motion.div)`
	width: 12px;
	height: 12px;
	background-color: ${props => props.theme.fontColor};
	border-radius: 50%;
	position: absolute;
`;

const ModeBallLight = styled(motion.div)`
	width: 12px;
	height: 12px;
	background-color: ${props => props.theme.fontColor};
	border-radius: 50%;
	position: absolute;
	right: 3px;
`;

const SubMenu = styled(motion.div)`
	width: 85px;
	height: 110px;
	background-color: ${props => props.theme.accentColor};
	position: absolute;
	top: 50px;
	left: 0;
	right: 0;
	margin: auto;
	text-align: center;
`;

const SearchIcon = styled.img`
	width: 18px;
	height: 18px;
`;

const subMenuVariant = {
	initial: {
		opacity: 0,
		y: -100,
	},
	animate: {
		opacity: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		y: -100,
	},
};

// eslint-disable-next-line prettier/prettier
export default function NavigationBar({ isDarkMode }: { isDarkMode: boolean }) {
	const nav = useNavigate();

	const [isSubMenuShown, setIsSubMenuShown] = useState(false);

	const changeTheme = () => {
		store.dispatch(changeThemeMode());
	};

	const selectRef = useRef<HTMLSelectElement>(null);

	const inputRef = useRef<HTMLInputElement>(null);

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		nav(`/posts/${selectRef.current?.value}/${inputRef.current?.value}`);
	};

	const [userId, setUserId] = useState<string>(() => {
		const userInfo = getCookie(MY_BLOG_COOKIE_NAME);
		if (userInfo) return userInfo[0];
		return '';
	});

	const logout = () => {
		const logoutConfirm = window.confirm('Are you sure to logout?');
		if (logoutConfirm) {
			removeCookie(MY_BLOG_COOKIE_NAME, {
				path: '/',
			});
			setUserId('');
			setIsSubMenuShown(false);
			nav('/posts');
		}
	};

	const toggleSubMenu = () => setIsSubMenuShown(!isSubMenuShown);

	const toWritePage = () => {
		if (getCookie(MY_BLOG_COOKIE_NAME)) nav('/write');
		else alert('Post Writing requires login!');
	};

	const setNavToMyPosts = () => {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) nav(`/posts/writer/${cookie[0]}`);
	};

	const setNavToLikedPosts = () => {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) nav(`/posts/favlist/${cookie[0]}`);
	};

	return (
		<Nav>
			<NavElem style={{ position: 'relative' }} onClick={toggleSubMenu}>
				{userId}
				<AnimatePresence>
					{isSubMenuShown ? (
						<SubMenu
							variants={subMenuVariant}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<br></br>
							<NavElem onClick={setNavToMyPosts}>
								MY POSTS
							</NavElem>
							<NavElem onClick={setNavToLikedPosts}>
								LIKED
							</NavElem>
						</SubMenu>
					) : null}
				</AnimatePresence>
			</NavElem>
			{userId ? <NavElem onClick={logout}>LOGOUT</NavElem> : null}
			{!userId ? <NavElem onClick={() => nav('/')}>LOGIN</NavElem> : null}
			<NavElem onClick={() => nav('/posts')}>POSTS</NavElem>
			<NavElem onClick={toWritePage}>WRITE</NavElem>
			<div style={{ flexGrow: '1' }}></div>
			<form onSubmit={handleOnSubmit}>
				<select ref={selectRef}>
					<option>title</option>
					<option>writer</option>
					<option>hashtag</option>
				</select>
				&ensp;
				<SearchIcon src={require('../search.png')} />
				&ensp;
				<input ref={inputRef} required />
			</form>
			&emsp;
			<ModeButton onClick={changeTheme}>
				{isDarkMode ? (
					<ModeBallDark layoutId={'ball'} />
				) : (
					<ModeBallLight layoutId={'ball'} />
				)}
			</ModeButton>
		</Nav>
	);
}
