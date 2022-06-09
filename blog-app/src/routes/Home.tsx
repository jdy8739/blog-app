import axios from "axios";
import React, { useEffect, useRef } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Span } from "../CommonStyles";
import BASE_URL from "../URLS";
import { getCookie, MY_BLOG_COOKIE_NAME, setCookie } from "../util/cookie";

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

    const toSignupPage = 
        (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        nav('/signup');
    };

    const signin = 
        async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const loginResult = axios.post(`${BASE_URL}/member/signin`, { 
            id: idRef.current?.value, 
            password: pwRef.current?.value
        });
        const token = (await loginResult).data;
        if(token) {
            const now = new Date();
            setCookie(
                MY_BLOG_COOKIE_NAME,
                JSON.stringify([idRef.current?.value, token]),
                { 
                    path: "/", 
                    expires: new Date(now.setMinutes(now.getMinutes() + 180)),
                    secure: true,
                    httpOnly: false
                }
            );
            nav('/posts/all');
        } else alert('There are no users that match the id and password.');
        loginResult.catch(err => console.log(err));
    };

    useEffect(() => {
        if(getCookie(MY_BLOG_COOKIE_NAME)) {
            alert('You are already loggedin.');
            nav('/posts');
        };
    }, []);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ 'MY BLOG' }</title>
                </Helmet>
            </HelmetProvider>
            <Box>
                <HomeTitle>Hello BLOG</HomeTitle>
                <Form onSubmit={signin}>
                    <label>
                        <h5>ID</h5>
                        <input 
                        ref={idRef}
                        required
                        />
                    </label>
                    &emsp;
                    <label>
                        <h5>PW</h5>
                        <input 
                        type="password" 
                        ref={pwRef}
                        required
                        />
                    </label>
                    <Span>
                        <button 
                        type="submit"
                        >sign in</button>
                        &emsp;
                        <button onClick={toSignupPage}>sign up</button>
                    </Span>
                </Form>
                <P onClick={() => nav('/posts')}>No Thanks. I'll use it without login.</P>
            </Box>
        </>
    )
};

export default Home;