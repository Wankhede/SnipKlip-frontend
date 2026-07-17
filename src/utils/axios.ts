import axios from 'axios';
import { backendBaseURLPath, frontendBaseURLPath } from 'config';
import { getSession, signOut } from 'next-auth/react';
import router from 'next/router';

export const axiosServicesFrontend = axios.create({ baseURL: frontendBaseURLPath });

const axiosServices = axios.create({
    baseURL: backendBaseURLPath,
    timeout: 20000
});
export const uninterceptedAxiosServices = axios.create({
    baseURL: backendBaseURLPath,
    timeout: 20000
});

const getErrorPayload = (error: any) => error?.response?.data || error?.message || 'Unable to reach the service';

let cachedAccessToken: string | null = null;
let tokenFetchedAt = 0;
const TOKEN_TTL_MS = 10 * 60 * 1000;

export const setAccessToken = (token: string | null) => {
    cachedAccessToken = token;
    tokenFetchedAt = token ? Date.now() : 0;
};

export const clearAccessToken = () => {
    cachedAccessToken = null;
    tokenFetchedAt = 0;
};

export const getAccessToken = async (): Promise<string | null> => {
    if (cachedAccessToken && Date.now() - tokenFetchedAt < TOKEN_TTL_MS) {
        return cachedAccessToken;
    }

    const session = await getSession();
    const accessToken = session?.token?.user?.data?.access_token || session?.token?.access_token || null;
    setAccessToken(accessToken);
    return accessToken;
};

const getBusinessContext = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    return {
        salon_id: Number(localStorage.getItem('salon_id')) || 0,
        user_id: Number(localStorage.getItem('user_id')) || 0,
        branch_id: Number(localStorage.getItem('branch_id')) || 0,
        group: localStorage.getItem('group') || '',
        subscription_name: localStorage.getItem('subscription_name') || ''
    };
};

axiosServicesFrontend.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(getErrorPayload(error))
);

axiosServices.interceptors.request.use(
    async (request) => {
        try {
            const accessToken = await getAccessToken();

            if (accessToken && request.headers) {
                request.headers.Authorization = `Bearer ${accessToken}`;
            }

            const method = request.method?.toUpperCase();
            const isFormData = typeof FormData !== 'undefined' && request.data instanceof FormData;
            const canAddContext =
                typeof window !== 'undefined' && !!accessToken && !isFormData && request.data && typeof request.data === 'object';

            if (canAddContext && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                request.data = {
                    ...request.data,
                    ...getBusinessContext()
                };
            }

            return request;
        } catch (error) {
            return Promise.reject(getErrorPayload(error));
        }
    },
    (error) => Promise.reject(getErrorPayload(error))
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const payload = getErrorPayload(error);

        if (typeof window !== 'undefined' && ((status === 401 && !window.location.href.includes('/login')) || status === 403)) {
            handleLogout();
        }

        if (typeof window !== 'undefined' && payload === 'DO-NOT-HAVE-SUBSCRIPTION') {
            router.push('/pricing');
        }

        return Promise.reject(payload);
    }
);

const handleLogout = () => {
    clearAccessToken();
    signOut({ redirect: false });
    router.push('/login');
};

export default axiosServices;
