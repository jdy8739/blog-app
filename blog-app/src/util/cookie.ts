import { Cookies } from 'react-cookie'

const cookies = new Cookies();

interface ICookieOpt {
    path: string;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
};

export const setCookie = (name: string, value: string, options: ICookieOpt)=>{
	return cookies.set(name, value, options);
};

export const getCookie = (name: string) => {
	return cookies.get(name);
};

export const removeCookie = (name: string, options: ICookieOpt) => {
    return cookies.remove(name, options);
};

export const MY_BLOG_COOKIE_NAME = 'my_blog_userInfo';