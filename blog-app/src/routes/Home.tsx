import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../axiosConfig";
import { Span } from "../CommonStyles";
import BASE_URL from "../URLS";
import { setCookie } from "../util/cookie";

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

    configAxios.interceptors.request.use(
        async config => {
            if(config.headers)
                if(idRef.current) {
                    config.headers['auth'] = idRef.current?.value || '';
                }
            console.log(config);
            return config;
        }
    );
    
    configAxios.interceptors.response.use(
        async config => {
            console.log(config);
            let token = '';
            if(config.headers) {
                const tmpToken = 
                    config.headers['token'];
                if(typeof tmpToken === 'string') {
                    token = tmpToken;
                }
            };
            setCookie(
                'my-blog-userInfo',
                token,
                { 
                    path: "/", 
                    expires: new Date('December 17, 2022 03:24:00'),
                    secure: true
                }
            );   
            return config;
        },
        ({ config, request, response, ...err }) => {
            const errMsg = 'Error Message';
            const isAxiosError = err.isAxiosError;
            const { status } = response;
            return Promise.reject({
                config,
                message: errMsg,
                response,
                isAxiosError
            });
        }
    );

    const signin = 
        (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        configAxios.post(`${BASE_URL}/member/signin`, { 
            id: idRef.current?.value, 
            password: pwRef.current?.value
        })
            .then(res => {
                if(res) {
                    nav('/posts');
                } else alert('Unvalid id or password!');
            })
            .catch(err => console.log(err));
    };

    return (
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
    )
};

export default Home;