import { useRouter } from 'next/router';
import { createContext, useEffect } from 'react';
import { listAccessKeyAssociationByGroup } from 'services/access-control';
import { useUserProfile } from './user-provider';

const AccessControl = createContext({});

function AccessControlProvider({ children }: any) {
    const { userData, loading } = useUserProfile();
    const router = useRouter();

    const fetchData = async () => {
        try {
            if (loading || !userData?.group) {
                return;
            }

            const { salon_id, branch_id, group, subscription_name } = userData;
            if (branch_id == null && group !== 'Admin') {
                await router.push('/apps/salon-onboarding');
                return;
            }
            localStorage.setItem('salon_id', String(salon_id ?? ''));
            localStorage.setItem('branch_id', String(branch_id ?? ''));
            localStorage.setItem('group', group);
            localStorage.setItem('subscription_name', subscription_name ?? '');

            await setAccess(salon_id, branch_id, group, subscription_name);
        } catch (error) {
            console.error('Error fetching access data:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    // Function to set access data retrieved from the API
    const setAccess = async (salon_id: string, branch_id: string, group: string, subscription_name: string) => {
        try {
            const accessResponse = await listAccessKeyAssociationByGroup({
                salon_id,
                branch_id,
                group,
                subscription_name
            });

            const keys = accessResponse?.data?.data?.WEB_HEADER || [];
            localStorage.setItem('accessKey', JSON.stringify({ WEB_HEADER: keys }));
        } catch (error) {
            console.error('Error setting access data:', error);
            localStorage.setItem('accessKey', JSON.stringify({ WEB_HEADER: [] }));
        }
    };

    // Context value with the fetchData function
    const contextValue = {
        fetchData
    };

    useEffect(() => {
        fetchData();
    }, [userData, loading]);

    return <AccessControl.Provider value={contextValue}>{children}</AccessControl.Provider>;
}

export default AccessControlProvider;
