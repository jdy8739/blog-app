import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Span } from "../CommonStyles";

const Box = styled.div`
    width: 370px;
    height: 250px;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

const HomeTitle = styled.div`
    font-size: 29px;
    text-align: center;
    margin-bottom: 30px;
`;

const Form = styled.form`
    text-align: center;
    input {
        width: 145px;
        background-color: transparent;
        border: 1px solid ${props => props.theme.accentColor};
        color: ${props => props.theme.fontColor};
        padding: 5px 8px;
        margin-top: 5px;
    }
    label {
        display: inline-block;
    }
`;

const P = styled.p`
    text-align: right;
    margin-top: 20px;
    font-size: 13px;
    cursor: pointer;
    &:hover {
        color: ${props => props.theme.accentColor};
    }
`;

function Home() {

    const nav = useNavigate();

    const idRef = 
        useRef<HTMLInputElement>(null);

    const pwRef = 
        useRef<HTMLInputElement>(null);

    const toSignupPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        nav('/signup');
    };

    const signin = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log(idRef.current?.value + ", " + pwRef.current?.value);
        
    };

    return (
        <Box>
            <HomeTitle>Hello BLOG</HomeTitle>
            <Form>
                <label>
                    <h5>ID</h5>
                    <input 
                    ref={idRef}
                    />
                </label>
                &emsp;
                <label>
                    <h5>PW</h5>
                    <input 
                    type="password" 
                    ref={pwRef}
                    />
                </label>
                <Span>
                    <button 
                    type="submit"
                    onClick={signin}
                    >sign in</button>
                    &emsp;
                    <button onClick={toSignupPage}>sign up</button>
                </Span>
            </Form>
            <P>No Thanks. I'll use it without login.</P>
        </Box>
    )
};

export default Home;