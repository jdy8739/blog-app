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
`;

const NavElem = styled.p`
    padding: 12px;
    font-size: 13px;
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.backgroundColor};
    }
`;

const ModeButton = styled.button`
    background-color: transparent;
    cursor: pointer;
    color: ${props => props.theme.fontColor};
    border: 1px solid ${props => props.theme.fontColor};
    padding: 8px;
    border-radius: 8px;
`;

export default function NavigationBar() {

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
        removeCookie('my_blog_userInfo', { path: '/' });
        setUserId('');
    };

    return (
        <Nav>
            <NavElem>{ userId }</NavElem>
            {
                userId ? <NavElem onClick={logout}>LOGOUT</NavElem> : null
            }
            {
                !userId ? <NavElem onClick={() => nav('/')}>LOGIN</NavElem> : null
            }
            <NavElem onClick={() => nav('/posts')}>POSTS</NavElem>
            <NavElem onClick={() => nav('/write')}>WRITE</NavElem>
            <NavElem>LIKED</NavElem>
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
            onClick={changeTheme}>{ 'mode' }</ModeButton>
        </Nav>
    )
};