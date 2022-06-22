import axios from 'axios';
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
		if (config.data['code']) {
			toast.error(config.data['description'], {
				...toastConfig,
				toastId: 'errorToast',
			});
			throw new Error();
		} else {
			return config;
		}
	},
	config => {
		toast.warn('This is an unvalid order.', toastConfig);
		return Promise.reject(config);
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
