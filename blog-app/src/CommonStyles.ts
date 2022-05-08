import styled from "styled-components";

export const Span = styled.span`
    display: flex;
    justify-content: right;
    margin-top: 60px;
    button {
        background-color: transparent;
        color: ${props => props.theme.fontColor};
        cursor: pointer;
        &:hover {
            color: ${props => props.theme.accentColor};
        }
    }
`;