import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { changeThemeMode, store } from "../store/themeStore";

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

    return (
        <Nav>
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
                <input ref={inputRef} required/>
            </form>
            &emsp;
            <ModeButton 
            onClick={changeTheme}>{ 'mode' }</ModeButton>
        </Nav>
    )
};