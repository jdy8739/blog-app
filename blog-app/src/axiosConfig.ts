import axios from "axios";
import { getCookie, MY_BLOG_COOKIE_NAME } from "./util/cookie";

export const configAxios = axios.create();

configAxios.interceptors.request.use(
    config => {
        if(config?.headers) {
            const cookie = getCookie(MY_BLOG_COOKIE_NAME);
            if(cookie) {
                config.headers['Authorization'] = `Bearer ${cookie[1]}`;
            };
        };
        return config;
    }
);

export const configModifyAxios = axios.create();

configModifyAxios.interceptors.request.use(
    config => {
        if(config?.headers) {
            config.headers['Authorization'] = 
                `Bearer ${getCookie(MY_BLOG_COOKIE_NAME)[1]}`;
            config.headers['request'] = "modify";
        };
        return config;
    }
);

configModifyAxios.interceptors.response.use(
    async config => {
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
            isAxiosError,
            status
        });
    }
);