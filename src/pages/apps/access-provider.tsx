import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { listAccessKeyAssociationByGroup } from 'services/access-control';
import {
  accessContextKey,
  ONBOARDING_PATH,
  shouldRedirectToOnboarding
} from 'utils/onboarding-navigation';
import { useUserProfile } from './user-provider';

type AccessControlContextValue = {
  accessKeys: string[];
  accessReady: boolean;
  hasAccess: (accessKey?: string) => boolean;
  fetchData: () => Promise<void>;
};

const AccessControl = createContext<AccessControlContextValue>({
  accessKeys: [],
  accessReady: false,
  hasAccess: () => true,
  fetchData: async () => undefined
});

const DEFAULT_SALON_KEYS = [
  'WEB_HEADER_DASHBOARD',
  'WEB_HEADER_BOOKING',
  'WEB_HEADER_CUSTOMER',
  'WEB_HEADER_BILLING',
  'WEB_HEADER_EMPLOYEE',
  'WEB_HEADER_REPORT',
  'WEB_HEADER_INVENTORY',
  'WEB_HEADER_EXPENSE',
  'WEB_HEADER_MEMBERSHIP',
  'WEB_HEADER_COUPON',
  'WEB_HEADER_REVIEW',
  'WEB_HEADER_LISTING',
  'WEB_HEADER_LISTING_PERSONAL',
  'WEB_HEADER_LISTING_SALON',
  'WEB_HEADER_SALARY',
  'WEB_HEADER_SERVICE'
];

const readStoredKeys = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const keysJSON = localStorage.getItem('accessKey');
    const parsed = keysJSON ? JSON.parse(keysJSON) : {};
    return Array.isArray(parsed?.WEB_HEADER) ? parsed.WEB_HEADER : [];
  } catch {
    return [];
  }
};

function AccessControlProvider({ children }: any) {
  const { userData, loading } = useUserProfile();
  const router = useRouter();
  const lastAccessKey = useRef('');
  const redirectedToOnboarding = useRef(false);
  const [accessKeys, setAccessKeys] = useState<string[]>(() => readStoredKeys());
  const [accessReady, setAccessReady] = useState<boolean>(() => readStoredKeys().length > 0);

  const persistKeys = useCallback((keys: string[]) => {
    const uniqueKeys = Array.from(new Set(keys.filter(Boolean)));
    localStorage.setItem('accessKey', JSON.stringify({ WEB_HEADER: uniqueKeys }));
    setAccessKeys(uniqueKeys);
    setAccessReady(true);
  }, []);

  const setAccess = useCallback(
    async (salon_id: string, branch_id: string, group: string, subscription_name: string) => {
      try {
        const accessResponse = await listAccessKeyAssociationByGroup({
          salon_id,
          branch_id,
          group,
          subscription_name
        });

        const keys = accessResponse?.data?.data?.WEB_HEADER || [];
        if (Array.isArray(keys) && keys.length > 0) {
          persistKeys(keys);
          return;
        }

        // Fallback so core salon pages remain visible when API returns empty
        if (group === 'Admin') {
          persistKeys([...DEFAULT_SALON_KEYS, 'WEB_HEADER_ADMIN_DASHBOARD', 'WEB_HEADER_KANABN']);
        } else if (group === 'Staff') {
          persistKeys([
            'WEB_HEADER_DASHBOARD',
            'WEB_HEADER_BOOKING',
            'WEB_HEADER_REPORT',
            'WEB_HEADER_LISTING',
            'WEB_HEADER_LISTING_PERSONAL'
          ]);
        } else {
          persistKeys(DEFAULT_SALON_KEYS);
        }
      } catch (error) {
        console.error('Error setting access data:', error);
        if (group === 'Admin') {
          persistKeys([...DEFAULT_SALON_KEYS, 'WEB_HEADER_ADMIN_DASHBOARD', 'WEB_HEADER_KANABN']);
        } else if (group === 'Staff') {
          persistKeys([
            'WEB_HEADER_DASHBOARD',
            'WEB_HEADER_BOOKING',
            'WEB_HEADER_REPORT',
            'WEB_HEADER_LISTING',
            'WEB_HEADER_LISTING_PERSONAL'
          ]);
        } else {
          persistKeys(DEFAULT_SALON_KEYS);
        }
      }
    },
    [persistKeys]
  );

  const fetchData = useCallback(async () => {
    try {
      if (loading || !userData?.group) {
        return;
      }

      const { salon_id, branch_id, group, subscription_name } = userData;
      const currentPath = router.asPath || '';

      if (
        shouldRedirectToOnboarding({
          loading,
          group,
          branchId: branch_id,
          currentPath
        })
      ) {
        if (!redirectedToOnboarding.current) {
          redirectedToOnboarding.current = true;
          await router.replace(ONBOARDING_PATH);
        }
        return;
      }

      redirectedToOnboarding.current = false;

      localStorage.setItem('salon_id', String(salon_id ?? ''));
      localStorage.setItem('branch_id', String(branch_id ?? ''));
      localStorage.setItem('group', group);
      localStorage.setItem('subscription_name', subscription_name ?? '');

      const nextKey = accessContextKey({
        salonId: salon_id,
        branchId: branch_id,
        group,
        subscriptionName: subscription_name
      });

      if (lastAccessKey.current === nextKey && accessReady) {
        return;
      }

      lastAccessKey.current = nextKey;
      await setAccess(salon_id, branch_id, group, subscription_name);
    } catch (error) {
      console.error('Error fetching access data:', error);
    }
  }, [loading, userData, router.asPath, setAccess, accessReady]);

  const hasAccess = useCallback(
    (accessKey?: string) => {
      if (typeof window === 'undefined') return true;
      const group = localStorage.getItem('group');
      if (group === 'Admin') return true;
      if (!accessKey) return true;
      if (!accessReady) return true; // avoid empty flash hiding all items pre-load
      return accessKeys.includes(accessKey);
    },
    [accessKeys, accessReady]
  );

  const contextValue = useMemo(
    () => ({
      accessKeys,
      accessReady,
      hasAccess,
      fetchData
    }),
    [accessKeys, accessReady, hasAccess, fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <AccessControl.Provider value={contextValue}>{children}</AccessControl.Provider>;
}

export const useAccessControl = () => useContext(AccessControl);

export default AccessControlProvider;
