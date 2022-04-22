import { useSelector } from "react-redux";
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

    return (
        <Nav>
            <div style={{ flexGrow: '1' }}></div>
            <ModeButton 
            onClick={changeTheme}>{ 'mode' }</ModeButton>
        </Nav>
    )
};