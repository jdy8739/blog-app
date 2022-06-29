import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getCookie, MY_BLOG_COOKIE_NAME } from './util/cookie';
import toastConfig from './util/toast';

export const BASE_URL = '';

const MODIFY = 'modify';

const defineAuthorization = (config: AxiosRequestConfig<unknown>) => {
	if (config?.headers) {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) {
			config.headers['Authorization'] = `Bearer ${cookie[1]}`;
		}
	}
};

const handleAxiosError = ({ config, response, ...err }: any) => {
	const errMsg = 'Error Message';
	const isAxiosError = err.isAxiosError;
	const { status } = response;
	const desc: string = response.data.description;
	if (status === 403) {
		toast.error(desc, {
			...toastConfig,
			toastId: '403ErrorToast',
		});
	} else if (status === 401) {
		toast.error(desc, {
			...toastConfig,
			toastId: '401ErrorToast',
		});
	} else {
		toast.error(desc || 'Unvalid access.', {
			...toastConfig,
			toastId: 'ErrorToast',
		});
	}
	return Promise.reject({
		config,
		message: errMsg,
		response,
		isAxiosError,
		status,
	});
};

export const configAxios = axios.create();

configAxios.interceptors.request.use(config => {
	defineAuthorization(config);
	return config;
});

configAxios.interceptors.response.use(
	config => {
		return config;
	},
	config => handleAxiosError(config),
);

export const configModifyAxios = axios.create();

configModifyAxios.interceptors.request.use(config => {
	defineAuthorization(config);
	if (config.headers) config.headers['request'] = MODIFY;
	return config;
});

configModifyAxios.interceptors.response.use(
	async config => {
		return config;
	},
	config => handleAxiosError(config),
);
