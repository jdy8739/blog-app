import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../../axiosConfig";
import { Span } from "../../CommonStyles";
import BASE_URL from "../../URLS";

const Input = styled.input<{ isFocused?: boolean }>`
    width: 175px;
    background-color: 
        ${props => props.isFocused ? props.theme.accentColor : 'transparent'};
    border: 1px solid ${props => props.theme.accentColor};
    color: ${props => props.theme.fontColor};
    padding: 5px 8px;
    margin-top: 5px;
    display: block;
    margin: 8px auto;
`;

const SignupForm = styled.form`
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto auto;
    height: 400px;
    width: 190px;
`;

const Info = styled.p`
    width: 175px;
    height: 20px;
    margin: auto;
    color: ${props => props.theme.accentColor};
    font-size: 12px;
`;

interface ISignupData {
    email: string;
    id: string;
    password: string;
    passwordCheck: string;
};

const emailRegex = 
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const passwordRegex = 
    /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;

function Signup() {

    const { 
        register, 
        handleSubmit, 
        formState: { errors },
        watch,
        setError } = useForm<ISignupData>();

    configAxios.interceptors.request.use(
       async config => {
           console.log(config);
           return config;
       }
    );

    configAxios.interceptors.response.use(
        async config => {
            console.log(config);
            return config;
        }
    );

    const signup = (data: ISignupData) => {
        if(data.password !== data.passwordCheck) {
            setError('passwordCheck', 
            { message: 'password and check are not identical.' },
            { shouldFocus: true })
        } else {
            configAxios.post(`${BASE_URL}/member/signup`, { ...data })
                .then(() => {
                    alert('Your data has been registered.');
                    nav('/');
                })
                .catch(err => console.log(err));
        }
    };

    const nav = useNavigate();

    return (
        <>
            <SignupForm onSubmit={handleSubmit(signup)}>
                <p 
                style={{ 
                    fontSize: '19px',
                    marginBottom: '15px'
                }}
                >SIGNUP FORM</p>
                <Input
                {
                    ...register("email", 
                    { 
                        required: 'Please input your email.',
                        pattern: {
                            value: emailRegex,
                            message: 'Please input correct email form.'
                        }
                    })
                }
                placeholder="email"
                />
                <Info>{ errors?.email?.message }</Info>
                <Input 
                {
                    ...register("id",
                    {
                        required: 'Please input your id.',
                        minLength: {
                            value: 7,
                            message: 'Id should be longer than 7.'
                        },
                        maxLength: {
                            value: 20,
                            message: 'Id should be shorter than 20.'
                        }
                    })
                }
                placeholder="id"
                />
                <Info>{ errors?.id?.message }</Info>
                <Input 
                {
                    ...register("password", {
                        minLength: {
                            value: 10,
                            message: 'password should be longer than 10.'
                        },
                        maxLength: {
                            value: 25,
                            message: 'password should be shorter than 25.'
                        },
                        validate: {
                            regex: value => 
                                (passwordRegex).test(value) ? true : 
                                    'Password should include at least one special symbol.'
                        }
                    })
                }
                placeholder="password"
                type="password"
                />
                <Info>{ errors?.password?.message }</Info>
                <Input 
                {
                    ...register("passwordCheck")
                }
                placeholder="password check"
                type="password"
                />
                <Info>{ errors?.passwordCheck?.message }</Info>
                <Span>
                    <button type="submit">submit</button>
                    &emsp;
                    <button onClick={() => nav('/')}>back</button>
                </Span>
            </SignupForm>
        </>
    )
};

export default Signup;