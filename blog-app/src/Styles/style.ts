import styled from "styled-components";

export const PostTitle = styled.h1`
    font-size: 47px;
`;

export const PostContentPreview = styled.div`
    position: absolute;
    bottom: 35px;
    left: 20px;
`;

export const PostCard = styled.div`
    width: 100%;
    height: 165px;
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

export const Button = styled.button<{ clicked?: boolean }>`
    background-color: 
        ${props => props.clicked ? props.theme.accentColor : props.theme.backgroundColor};
    color: ${props => props.theme.fontColor};
    margin: 7px;
    padding: 4px 12px;
    font-weight: bold;
    border-radius: 7px;
    cursor: pointer;
`;

export const Tag = styled.p`
    display: inline-block;
    margin: 5px;
    border: 1px solid ${props => props.theme.accentColor};
    border-radius: 12px;
    font-size: 11px;
    color: ${props => props.theme.fontColor};
    padding: 8px;
    box-sizing: border-box;
    &:hover {
        background-color: 
            ${props => props.theme.accentColor};
    }
`;

export const Highlight = styled.div`
    color: ${props => props.theme.accentColor};
    display: inline-block;
`;

export const TitleInput = styled.input`
    border: 1px solid ${props => props.theme.accentColor};
    padding: 9px;
    width: 100%;
    box-sizing: border-box;
    background-color: ${props => props.theme.inputColor};
    color: ${props => props.theme.fontColor};
`;

export const TagInput = styled(TitleInput)`
    width: 230px;
    margin: 16px 0;
`;

export const ContentInput = styled.textarea`
    width: 100%;
    height: 350px;
    border: 1px solid ${props => props.theme.accentColor};
    padding: 9px;
    box-sizing: border-box;
    resize: none;
    background-color: ${props => props.theme.inputColor};
    color: ${props => props.theme.fontColor};
`;

