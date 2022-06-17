import axios from 'axios';
import { config } from 'process';
import { toast } from 'react-toastify';
import { getCookie, MY_BLOG_COOKIE_NAME } from './util/cookie';
import toastConfig from './util/toast';

export const BASE_URL = 'http://localhost:7777';

export const configAxios = axios.create();

configAxios.interceptors.request.use(config => {
	if (config?.headers) {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) {
			config.headers['Authorization'] = `Bearer ${cookie[1]}`;
		}
	}
	return config;
});

configAxios.interceptors.response.use(
	config => {
		return config;
	},
	config => {
		//toast 창이 안띄워지는 문제 있음.
		if (config.response.status !== 200) {
			toast.warn('This is an unvalid order.', {
				...toastConfig,
				toastId: 'replyDeleteWarnToast',
			});
		}
		console.log('hh');
		return config;
	},
);

export const configModifyAxios = axios.create();

configModifyAxios.interceptors.request.use(config => {
	if (config?.headers) {
		config.headers['Authorization'] = `Bearer ${
			getCookie(MY_BLOG_COOKIE_NAME)[1]
		}`;
		config.headers['request'] = 'modify';
	}
	return config;
});

configModifyAxios.interceptors.response.use(
	async config => {
		return config;
	},
	({ config, response, ...err }) => {
		const errMsg = 'Error Message';
		const isAxiosError = err.isAxiosError;
		const { status } = response;
		if (status === 401) {
			toast.error('You cannot access this post for modification!', {
				...toastConfig,
				toastId: 'cannotAccessWarnToast',
			});
		}
		return Promise.reject({
			config,
			message: errMsg,
			response,
			isAxiosError,
			status,
		});
	},
);
