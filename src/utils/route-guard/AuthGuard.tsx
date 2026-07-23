import { useEffect } from 'react';

// next
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

// types
import { GuardProps } from 'types/auth';
import Loader from 'components/Loader';

// ==============================|| AUTH GUARD ||============================== //

const AuthGuard = ({ children }: GuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (status === 'unauthenticated' || !session?.user) {
      router.replace({
        pathname: '/login',
        query: { from: router.asPath }
      });
    }
  }, [status, session?.user, router]);

  if (status === 'loading' || !session?.user) return <Loader />;

  return children;
};

export default AuthGuard;
