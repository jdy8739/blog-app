import { AnimatePresence, motion } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { changeThemeMode } from '../store/themeStore';
import { changeUserId } from '../store/userIdStore';
import { getCookie, MY_BLOG_COOKIE_NAME, removeCookie } from '../util/cookie';
import toastConfig from '../util/toast';
import ModalComponent from './ModalComponent';

const Bar = styled.div`
	width: 100vw;
	height: 57px;
	background-color: ${props => props.theme.accentColor};
	position: fixed;
	top: 0;
	z-index: 99;
	@media screen and (max-width: 768px) {
		height: 104px;
	}
`;

const Nav = styled.nav`
	display: block;
	margin: auto;
	width: 100%;
	max-width: 2000px;
	min-width: 340px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px 42px;
	box-sizing: border-box;
`;

const NavOne = styled.div`
	display: flex;
	align-items: center;
	@media screen and (max-width: 768px) {
		position: absolute;
		top: 65px;
		width: 100%;
		justify-content: space-around;
	}
`;

const NavTwo = styled.div`
	display: flex;
	align-items: center;
	@media screen and (max-width: 768px) {
		position: absolute;
		top: 15px;
		width: 100%;
		justify-content: space-around;
	}
`;

const NavElem = styled.div`
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

const ModeBall = styled.div<{ isDarkMode: boolean }>`
	width: 12px;
	height: 12px;
	background-color: ${props => props.theme.fontColor};
	border-radius: 50%;
	position: absolute;
	transition: transform 1s;
	transform: translateX(${props => (props.isDarkMode ? '0px' : '18px')});
`;

const SubMenu = styled(motion.div)`
	width: 85px;
	height: 110px;
	background-color: ${props => props.theme.accentColor};
	position: absolute;
	top: 38px;
	left: 0;
	right: 0;
	margin: auto;
	text-align: center;
`;

const SearchElement = styled.div`
	padding: 4px;
	border-radius: 8px;
	border: none;
	background-color: ${props => props.theme.backgroundColor};
	color: ${props => props.theme.fontColor};
	&:focus {
		border: 1.5px solid ${props => props.theme.fontColor};
		outline: none;
	}
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

	const dispatch = useDispatch();

	const [isSubMenuShown, setIsSubMenuShown] = useState(false);

	const [isModalShown, setIsModalShown] = useState(false);

	const selectRef = useRef<HTMLSelectElement>(null);

	const inputRef = useRef<HTMLInputElement>(null);

	const userId = useSelector((state: { userIdChanger: { id: string } }) => {
		return state.userIdChanger.id;
	});

	const changeTheme = () => {
		dispatch(changeThemeMode());
	};

	const setUserId = (id: string) => {
		dispatch(changeUserId(id));
	};

	const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		nav(`/posts/${selectRef.current?.value}/${inputRef.current?.value}`);
	};

	const logout = () => {
		removeCookie(MY_BLOG_COOKIE_NAME, {
			path: '/',
		});
		setUserId('');
		nav('/posts');
	};

	const toggleSubMenu = (e: React.MouseEvent<HTMLParagraphElement>) => {
		if (e.currentTarget.id === 'user_id') {
			e.stopPropagation();
		}
		setIsSubMenuShown(!isSubMenuShown);
	};

	const toWritePage = () => {
		if (getCookie(MY_BLOG_COOKIE_NAME)) nav('/write');
		else
			toast.warn('Post Writing requires login!', {
				...toastConfig,
				toastId: 'writeWarnToast',
			});
	};

	const setNavToSubMenuPage = (route: number) => {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie)
			nav(`/posts/${route === 1 ? 'writer' : 'favlist'}/${cookie[0]}`);
	};

	const hideSebMenu = () => setIsSubMenuShown(false);

	return (
		<Bar>
			<Nav onClick={hideSebMenu} onMouseLeave={hideSebMenu}>
				<NavOne>
					{userId && (
						<NavElem
							style={{ position: 'relative' }}
							id="user_id"
							onClick={toggleSubMenu}
						>
							<p>{userId}</p>
							<AnimatePresence>
								{isSubMenuShown && (
									<SubMenu
										variants={subMenuVariant}
										initial="initial"
										animate="animate"
										exit="exit"
									>
										<br></br>
										<NavElem
											onClick={() => setNavToSubMenuPage(1)}
										>
											MY POSTS
										</NavElem>
										<NavElem
											onClick={() => setNavToSubMenuPage(2)}
										>
											LIKED
										</NavElem>
									</SubMenu>
								)}
							</AnimatePresence>
						</NavElem>
					)}
					{userId && (
						<NavElem onClick={() => setIsModalShown(true)}>
							LOGOUT
						</NavElem>
					)}
					{!userId && <NavElem onClick={() => nav('/')}>LOGIN</NavElem>}
					<NavElem onClick={() => nav('/posts')}>POSTS</NavElem>
					<NavElem onClick={toWritePage}>WRITE</NavElem>
				</NavOne>
				<div style={{ flexGrow: '1' }}></div>
				<NavTwo>
					<form onSubmit={handleOnSubmit}>
						<SearchElement ref={selectRef} as="select">
							<option>title</option>
							<option>writer</option>
							<option>hashtag</option>
						</SearchElement>
						&ensp;
						<SearchIcon src={process.env.PUBLIC_URL + '/search.png'} />
						&ensp;
						<SearchElement ref={inputRef} as="input" required />
					</form>
					&emsp;
					<ModeButton onClick={changeTheme}>
						<ModeBall isDarkMode={isDarkMode} />
					</ModeButton>
				</NavTwo>
				<ModalComponent
					isModalShown={isModalShown}
					setIsModalShown={setIsModalShown}
					action={logout}
					sentence={'Are you sure to log out?'}
				/>
			</Nav>
		</Bar>
	);
}
