import { Cookies } from 'react-cookie'

const cookies = new Cookies();

interface ICookieOpt {
    path: string;
    expires: Date;
    secure?: boolean;
    httpOnly?: boolean;
}

export const setCookie = (name: string, value: string, options: ICookieOpt)=>{
	return cookies.set(name, value, options);
};

export const getCookie = (name: string) => {
	return cookies.get(name);
};