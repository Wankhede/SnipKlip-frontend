const website = process.env.NEXT_PUBLIC_COMPANY_WEBSITE || 'https://snipklip.in';

export const BRAND = {
    COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || 'SnipKlip',
    COMPANY_WEBSITE: website,
    PRIMARY_COLOR: '#000080',
    SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@snipklip.in',
    ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@snipklip.in',
    CONTACT_NUMBER: process.env.NEXT_PUBLIC_CONTACT_NUMBER || '',
    BLOG_URL: process.env.NEXT_PUBLIC_BLOG_URL || `${website}/blog`,
    BROCHURE_LINK: process.env.NEXT_PUBLIC_BROCHURE_LINK || `${website}/SnipKlip-Brochure.pdf`,
    LOGO: process.env.NEXT_PUBLIC_LOGO || '/assets/images/logo-white.svg',
    LOGO_DARK: process.env.NEXT_PUBLIC_LOGO_DARK || '/assets/images/logo-black.svg',
    FAVICON: process.env.NEXT_PUBLIC_FAVICON || '/favicon.svg',
    SOCIAL_LINKS: {
        instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
        linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '',
        facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || ''
    },
    META: {
        title: 'SnipKlip — Salon Management Platform',
        description: 'Manage salon bookings, customers, staff, inventory, billing, subscriptions, and business insights in one platform.'
    }
} as const;
