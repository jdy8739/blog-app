import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { changeThemeMode, store } from "../store/themeStore";
import { getCookie, removeCookie } from "../util/cookie";

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

const subMenuVariant = {
    initial: {
        opacity: 0,
        y: -100
    },
    animate: {
        opacity: 1,
        y: 0
    },
    exit: {
        opacity: 0,
        y: -100
    }
};

export default function NavigationBar({ isDarkMode }: { isDarkMode: boolean }) {

    const changeTheme = () => {
        store.dispatch(changeThemeMode());
    };

    const selectRef = useRef<HTMLSelectElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        nav(`/posts/${selectRef.current?.value}/${inputRef.current?.value}`);
    };

    const nav = useNavigate();

    const [userId, setUserId] = useState('');

    let userInfo = '';

    if(!userId) {
        userInfo = getCookie('my_blog_userInfo');
        if(userInfo)
            setUserId(userInfo[0]);
    };
    
    const logout = () => {
        const logoutConfirm = window.confirm('Are you sure to logout?');
        if(logoutConfirm) {
            removeCookie('my_blog_userInfo', { path: '/' });
            setUserId('');
            setIsSubMenuShown(false);
            nav('/posts');
        };
    };

    const [isSubMenuShown, setIsSubMenuShown] = useState(false);

    const toggleSubMenu = 
        () => setIsSubMenuShown(isSubMenuShown => !isSubMenuShown);

    const toWritePage = () => {
        if(getCookie('my_blog_userInfo'))
            nav('/write');
        else alert('Post Writing requires login!');
    }

    return (
        <Nav>
            <NavElem 
            style={{ position: 'relative' }}
            onClick={toggleSubMenu}
            >
                { userId }
                <AnimatePresence>
                    { isSubMenuShown ? 
                    <SubMenu 
                    variants={subMenuVariant}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    >
                        <br></br>
                        <NavElem>MY POSTS</NavElem>
                        <NavElem>LIKED</NavElem>
                    </SubMenu>
                    : null }
                </AnimatePresence>
            </NavElem>
            {
                userId ? <NavElem onClick={logout}>LOGOUT</NavElem> : null
            }
            {
                !userId ? <NavElem onClick={() => nav('/')}>LOGIN</NavElem> : null
            }
            <NavElem onClick={() => nav('/posts')}>POSTS</NavElem>
            <NavElem onClick={toWritePage}>WRITE</NavElem>
            <div style={{ flexGrow: '1' }}></div>
            <form onSubmit={handleOnSubmit}>
                <select 
                ref={selectRef}
                >
                    <option>title</option>
                    <option>writer</option>
                    <option>hashtag</option>
                </select>
                &ensp;
                <button>search</button>
                &ensp;
                <input
                ref={inputRef} 
                required
                />
            </form>
            &emsp;
            <ModeButton 
            onClick={changeTheme}>
                {
                    isDarkMode ? 
                    <ModeBallDark
                    layoutId={"ball"}
                    /> :
                    <ModeBallLight
                    layoutId={"ball"}
                    />
                }
            </ModeButton>
        </Nav>
    )
};