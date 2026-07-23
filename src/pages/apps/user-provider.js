import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserDetails } from 'services/user';
import { clearAccessToken, setAccessToken } from 'utils/axios';

const UserContext = createContext();

const DEFAULT_SALON_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_SALON_ID || 3);
const DEFAULT_BRANCH_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_BRANCH_ID || 1);

const initialFormValues = {
    user_id: undefined,
    salon_id: undefined,
    branch_id: undefined,
    subscription_name: undefined,
    group: undefined,
    current_page: undefined
};

/** Admin accounts often return -1/-1; resolve to a real tenant for list APIs. */
const normalizeTenantIds = (data = {}) => {
    const next = { ...data };
    if (Number(next.salon_id) < 0) next.salon_id = DEFAULT_SALON_ID;
    if (Number(next.branch_id) < 0) next.branch_id = DEFAULT_BRANCH_ID;
    return next;
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initialFormValues);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const fetchedUserKey = useRef('');

    const setLocalStorage = (data) => {
        const storage = window.localStorage;
        storage.setItem('user_id', data.user_id ?? '');
        storage.setItem('branch_id', data.branch_id ?? '');
        storage.setItem('salon_id', data.salon_id ?? '');
        storage.setItem('subscription_name', data.subscription_name ?? '');
        storage.setItem('group', data.group ?? '');
    };

    const fetchData = async (userKey) => {
        try {
            if (!session) {
                return;
            }
            const user_details = {
                email: session?.token?.email,
                user_id: session?.token?.user?.data?.user_id
            };
            const response = await getUserDetails(user_details);
            if (response.data.status === 200) {
                const normalized = normalizeTenantIds(response.data.data);
                setLocalStorage(normalized);
                const updatedUserData = {
                    ...normalized,
                    current_page: window.localStorage.getItem('current_page')
                };
                setUserData(updatedUserData);
                fetchedUserKey.current = userKey;
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            fetchedUserKey.current = '';
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated' && session) {
            const accessToken = session?.token?.user?.data?.access_token || session?.token?.access_token || null;
            const userKey = String(
                session?.token?.user?.data?.user_id ||
                    session?.token?.email ||
                    session?.user?.email ||
                    accessToken ||
                    ''
            );
            setAccessToken(accessToken);
            if (fetchedUserKey.current === userKey) {
                setLoading(false);
                return;
            }
            fetchData(userKey);
        } else if (status === 'unauthenticated') {
            clearAccessToken();
            fetchedUserKey.current = '';
            setUserData(initialFormValues);
            setLoading(false);
        }
    }, [session, status]);

    return <UserContext.Provider value={{ userData, loading }}>{children}</UserContext.Provider>;
};

export const useUserProfile = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

export default UserProvider;
