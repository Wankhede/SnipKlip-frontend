export type AccessContext = {
  salonId?: string | number | null;
  branchId?: string | number | null;
  group?: string | null;
  subscriptionName?: string | null;
};

export type OnboardingRedirectInput = {
  loading: boolean;
  group?: string | null;
  branchId?: string | number | null;
  currentPath: string;
};

export const ONBOARDING_PATH = '/apps/salon-onboarding';
export const BOOKING_NEXT_PATH = '/apps/bookings/add-bookings';

export const accessContextKey = ({
  salonId,
  branchId,
  group,
  subscriptionName
}: AccessContext): string =>
  [salonId ?? '', branchId ?? '', group ?? '', subscriptionName ?? ''].join(':');

export const shouldRedirectToOnboarding = ({
  loading,
  group,
  branchId,
  currentPath
}: OnboardingRedirectInput): boolean => {
  if (loading || !group || group === 'Admin') {
    return false;
  }

  if (branchId != null && branchId !== '') {
    return false;
  }

  const normalizedPath = currentPath.split('?')[0];
  return normalizedPath !== ONBOARDING_PATH;
};
