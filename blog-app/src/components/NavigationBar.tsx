import styled from "styled-components";

const Nav = styled.nav`
    width: 100vw;
    height: 52px;
    background-color: ${props => props.theme.accentColor};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function NavigationBar() {
    return (
        <Nav>
        </Nav>
    )
};