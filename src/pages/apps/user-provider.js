import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserDetails } from 'services/user';
import { clearAccessToken, setAccessToken } from 'utils/axios';

const UserContext = createContext();

const initialFormValues = {
    user_id: undefined,
    salon_id: undefined,
    branch_id: undefined,
    subscription_name: undefined,
    group: undefined,
    current_page: undefined
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(initialFormValues);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
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
                setLocalStorage(response.data.data);
                const updatedUserData = {
                    ...response.data.data,
                    current_page: window.localStorage.getItem('current_page')
                };
                setUserData(updatedUserData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const setLocalStorage = (data) => {
        const storage = window.localStorage;
        storage.setItem('user_id', data.user_id ?? '');
        storage.setItem('branch_id', data.branch_id ?? '');
        storage.setItem('salon_id', data.salon_id ?? '');
        storage.setItem('subscription_name', data.subscription_name ?? '');
        storage.setItem('group', data.group ?? '');
    };

    useEffect(() => {
        if (status === 'authenticated' && session) {
            const accessToken = session?.token?.user?.data?.access_token || session?.token?.access_token || null;
            setAccessToken(accessToken);
            fetchData();
        } else if (status === 'unauthenticated') {
            clearAccessToken();
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
