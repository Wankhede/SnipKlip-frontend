import axios from 'axios';
import { backendBaseURLPath, frontendBaseURLPath } from 'config';
import { getSession, signOut } from 'next-auth/react';
import router from 'next/router';

export const axiosServicesFrontend = axios.create({ baseURL: frontendBaseURLPath });

const axiosServices = axios.create({ baseURL: backendBaseURLPath });
export const uninterceptedAxiosServices = axios.create({ baseURL: backendBaseURLPath });

const getErrorPayload = (error: any) => error?.response?.data || error?.message || 'Unable to reach the service';

axiosServicesFrontend.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(getErrorPayload(error))
);

axiosServices.interceptors.request.use(
    async (request) => {
        try {
            const session = await getSession();
            const accessToken = session?.token?.user?.data?.access_token || session?.token?.access_token;

            if (accessToken && request.headers) {
                request.headers.Authorization = `Bearer ${accessToken}`;
            }

            const method = request.method?.toUpperCase();
            const isFormData = typeof FormData !== 'undefined' && request.data instanceof FormData;
            const canAddContext =
                typeof window !== 'undefined' && session && !isFormData && request.data && typeof request.data === 'object';

            if (canAddContext && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                request.data = {
                    ...request.data,
                    salon_id: Number(localStorage.getItem('salon_id')) || 0,
                    user_id: Number(localStorage.getItem('user_id')) || 0,
                    branch_id: Number(localStorage.getItem('branch_id')) || 0,
                    group: localStorage.getItem('group') || '',
                    subscription_name: localStorage.getItem('subscription_name') || ''
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
    signOut({ redirect: false });
    router.push('/login');
};

export default axiosServices;
