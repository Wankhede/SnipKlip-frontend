import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Bumps a refresh key whenever the user returns to a manage/list route
 * (or when the window regains focus), so CustomTable refetches without a hard reload.
 */
export default function useListRefresh(matchPath?: string) {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const bump = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const path = matchPath || router.pathname;
    const onRoute = (url: string) => {
      if (!path) return;
      if (url === path || url.startsWith(path + '?') || url.includes(path)) {
        bump();
      }
    };
    const onFocus = () => {
      if (typeof window === 'undefined') return;
      if (window.location.pathname === path || window.location.pathname.includes(path.split('/').slice(-1)[0] || '')) {
        bump();
      }
    };

    router.events.on('routeChangeComplete', onRoute);
    window.addEventListener('focus', onFocus);
    return () => {
      router.events.off('routeChangeComplete', onRoute);
      window.removeEventListener('focus', onFocus);
    };
  }, [router.events, router.pathname, matchPath, bump]);

  return { refreshKey, bumpRefresh: bump };
}
