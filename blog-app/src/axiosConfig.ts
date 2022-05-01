import axios from "axios";
import { getCookie, MY_BLOG_COOKIE_NAME } from "./util/cookie";

export const configAxios = axios.create();

export const boardAxios = axios.create();

boardAxios.interceptors.request.use(
    config => {
        if(config?.headers) 
            config.headers['Authorization'] = 
                `Bearer ${getCookie(MY_BLOG_COOKIE_NAME)[1]}`;
        return config;
    }
);