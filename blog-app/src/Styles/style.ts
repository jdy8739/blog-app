import styled from "styled-components";

export const PostTitle = styled.h1`
    font-size: 57px;
`;

export const PostContentPreview = styled.div`
    position: absolute;
    bottom: 35px;
    left: 20px;
`;

export const PostCard = styled.div`
    width: 100%;
    height: 165px;
    border-bottom: 1px solid ${props => props.theme.accentColor};
    padding: 12px;
    box-sizing: border-box;
    margin-top: 25px;
    position: relative;
    cursor: pointer;
    &:hover {
        ${PostTitle} {
            color: ${props => props.theme.accentColor}; 
        }
    }
`;

export const Container = styled.div`
    width: 70vw;
    min-width: 768px;
    margin: 125px auto;
    ${PostCard}:last-child {
        border: none;
    }
`;

export const PostLikes = styled.p`
    position: absolute;
    bottom: 60px;
    right: 20px;
`;

export const PostWriter = styled.span`
    position: absolute;
    bottom: 35px;
    right: 20px;
    font-size: 12px;
`;

export const Button = styled.button`
    background-color: ${props => props.theme.accentColor};
    color: ${props => props.theme.fontColor};
    margin: 7px;
    padding: 4px 12px;
    font-weight: bold;
    border-radius: 7px;
    cursor: pointer;
`;

